## docker部署gitlab
+ docker pull gitlab/gitlab-ce
+ docker run --detach \
  --publish 8443:443 --publish 8880:80 --publish 8822:22 \
  --name gitlab \
  --volume /Users/zhangyujie/Documents/docker/gitlab/config:/etc/gitlab \
  --volume /Users/zhangyujie/Documents/docker/gitlab/logs:/var/log/gitlab \
  --volume /Users/zhangyujie/Documents/docker/gitlab/data:/var/opt/gitlab \
  gitlab/gitlab-ce

+ 修改 .../gitlab/config/gitlab.rb，
  + 添加：external_url 'http://127.0.0.1' 后台管理访问地址
  + 设置ssh主机ip和端口
    + gitlab_rails['gitlab_ssh_host'] = '127.0.0.1'
    + gitlab_rails['gitlab_shell_ssh_port'] = '8822'
+ 重载服务
  + 终端运行：docker exec -t gitlab gitlab-ctl reconfigure
  + 终端运行：docker exec -t gitlab gitlab-ctl restart
+ 修改root密码
  + docker exec -it gitlab /bin/bash <!-- 进入容器内部终端-->
  + gitlab-rails console -e production <!-- 进入控制台-->
  + user = User.where(id:1).first <!-- 查询id为1的用户，id为1的用户是超级管理员-->
  + user.password='11111111' <!-- 修改密码为11111111-->
  + user.save! <!-- 保存-->
  + exit <!-- 退出-->

## 注册gitlab-runner
+ 安装gitlab-runner brew install gitlab-runner
+ 启动并注册为启动项 brew services start gitlab-runner
+ 注册： gitlab-runner register --url http://127.0.0.1/ --registration-token GR1348941rQANvwQHQk3Y1ysxXiap

## .gitlab.yml
```yml
stages:
  - lint
  - build
  # - deploy

image: node

# 缓存node_modules
cache:
  key: ${CI_PROJECT_NAME}
  paths: [node_modules/]

lint:
  tags:
    - shared
  stage: lint
  script:
    - npm i
    # 拉取分支信息，后面可以diff
    - git fetch origin
    # 存储此次merge_request的变更描述，可以写个脚本按行读取，生成changelog
    # - git log origin/main..origin/$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME --pretty=format:"%s" > commit_messages.txt
    # 规定当前分支必须要从main分支切出，可以在这里用eslint检查与main分支有差别的文件
    - git diff --name-only "origin/main...HEAD" --diff-filter=ACM | grep -E '.*\.(vue|js)$' | xargs eslint
  only:
    refs:
      - merge_requests # 当merge-request开启或更新的时候，执行
  except:
    refs:
      - develop # develop分支不执行
  # artifacts:
  #   paths:
  #     - commit_messages.txt

build:
  tags:
    - shared
  stage: build
  script:
    - npm run build
  # develop分支和main分支执行build
  only:
    refs:
      - develop
      - main

```