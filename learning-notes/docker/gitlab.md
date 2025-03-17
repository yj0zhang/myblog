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
+ 下载gitlab-runner镜像 docker pull gitlab/gitlab-runner:latest
+ 创建并运行gitlab runner容器 
  + docker run -d --name gitlabRunner \
    -v /host/gitlab-runner/config:/etc/gitlab-runner \
    -v /host/var/run/docker.sock:/var/run/docker.sock \
    gitlab/gitlab-runner:latest
+ 在gitlab的runner配置页面，获取registration，注册runner： 
  + docker exec -it gitlabRunner gitlab-runner register --url http://192.168.1.5:8880/ --registration-token GR1348941rQANvwQHQk3Y1ysxXiap
  + Please enter the executor选docker
  + Please enter the default Docker image 写alpine:latest

## .gitlab.yml
