## cicd 是什么

在开发过程中，为了保证代码质量、简化合并和部署的流程，需要用到 cicd。
ci 就是持续集成，在 pr open 和 pr 更新时，执行代码 eslint 和 prettier 检查，可以快速发现代码问题，保证代码质量；中间可以集成企业微信消息，通知执行结果
cd 就是持续部署，在 pr 被合并后，进行代码构建，docker 镜像打包，打包成功后再打个版本 tag，最后发布到服务器；中间可以集成企业微信消息，通知执行结果

借助的工具是 gitlab-runner 和 gitlab-ci

ci 阶段可以自动合并代码吗？
cicd 在发送企业微信的时候，如何获取 commit-msg，让通知更加语义化？
ci 检查代码时，eslint 和 prettier 是否可以支持增量检查？
changelog ? 根据 commit-msg 生成
Preview/Review App ?
lint-staged ?
husky(git hooks)

cd 是否可以和 jenkins 结合？
docker-compose

## gitlab-runner

cicd 是持续集成和持续部署，使用 gitlab-runner 和 gitlab-ci 实现

- gitlab-runner ?
- gitlab-ci ?

<!-- stages:
  - install
  - build
  - makeimage
  - publish
  - buildNotify
  - deploy

include:
  - local: .gitlab/ci/build.yaml
  - local: .gitlab/ci/publish.yaml
  - local: '.gitlab-ci-payroll.yml'

image: node:14.15.0

variables:
  SSH_OPTS: '-o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no'
  PAYROLL_IMAGE_PATH: harbor.peoplus.cn/f2e/venus/venus-frontend/feature/payroll:latest
  PERFORMANCE_IMAGE_PATH: harbor.peoplus.cn/performance/venusweb:pmu-last
  WeChat_KEY: b8a8681b-2e3f-400c-bb7c-1a0fa05b7978

.cache: &cache
  key: '${CI_PROJECT_PATH}-${CI_COMMIT_REF_SLUG}'
  paths:
    - ci_cache/
    - node_modules/

### stable/commission 分支
build_stable_commission_job:
  stage: build
  cache:
    <<: *cache
  script:
    - mkdir -p /usr/local/ci_yarn_cache
    - set NODE_OPTIONS=--max-old-space-size=4096
    - yarn config set cache-folder /usr/local/ci_yarn_cache
    - yarn config set registry https://registry.npmmirror.com
    - rm -rf node_modules/
    - yarn install
    - NODE_OPTIONS=--max_old_space_size=8192 yarn run build-all develop commission login f2e
  artifacts:
    paths:
      - dist/
      - Dockerfile
  only:
    - feature/commission
    - stable/commission

makeimage_stable_commission_job:
  image: docker:stable
  services:
    - docker:dind
  before_script:
    - docker info
  stage: makeimage
  script:
    - docker build --pull -t harbor.peoplus.cn/peoplus-v2/venusweb:test .
    - docker login -u ${HARBOR_USERNAME} -p ${HARBOR_PASSWORD} http://harbor.peoplus.cn
    - docker push harbor.peoplus.cn/peoplus-v2/venusweb:test
    - docker rmi harbor.peoplus.cn/peoplus-v2/venusweb:test
  only:
    - feature/commission
    - stable/commission

deploy_stable_commission_job:
  stage: deploy
  before_script:
    - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
    - eval $(ssh-agent -s)
    - echo "${DEPLOY_TEST_SSH_KEY}" | tr -d '\r' | ssh-add - > /dev/null
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh $SSH_OPTS ${DEPLOY_TEST_HOST} -p ${SSH_PORT}  "docker pull harbor.peoplus.cn/peoplus-v2/venusweb:test; docker pull harbor.peoplus.cn/venus/loopback:test; eroadctl proxima_test reload;"
    - echo "http://${DEPLOY_TEST_HOST}:${DEPLOY_TEST_PORT}"
  only:
    - feature/commission
    - stable/commission
  when: manual -->

## cicd 过程示例

- lint （发起 merge_request 或者 merge_request 更新的时候）
  - 使用 git diff 命令，与主分支对比，找出本次更新修改的所有文件
  - 把修改的文件用 eslint 命令检查一遍
  - lint 结果发送企业微信消息，失败的话，开发去改，成功的话，准备 codereview 合并代码
- 代码合并后：
- build
  - 安装依赖包
  - 执行 build 命令
  - 打包生产环境的 dist 文件
- makeimage
  - 使用 docker 制作前端镜像，上传到自己的镜像库
- deploy
  - 登录部署服务器，执行发布脚本
