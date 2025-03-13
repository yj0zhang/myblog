## gitlab-runner
cicd是持续集成和持续部署，使用gitlab-runner和gitlab-ci实现
- gitlab-runner ?
- gitlab-ci ?

ci阶段
- 代码eslint和prettier检查，不通过需要发企业微信消息（添加WIP标签），通过的话，移除WIP标签并发送企业微信消息，做code review，最后合并

Preview App ?
lint-staged ?
husky(git hooks)

ci阶段结束后，代码合并到测试分支，执行cd步骤
cd阶段
- build 前端构建
- makeimage 制作docker镜像并上传到私有镜像服务器
- deploy 部署，ssh登录部署服务器，执行部署脚本
- 部署成功后，发送企业微信消息

cd是否可以和jenkins结合？
docker-compose


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
