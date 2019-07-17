- 查看所有分支：git branch -a
- 查看远程分支：git branch -r
- 查看已经merge的分支：git branch --merged
- 查看没有merge的分支：git branch --no-merged

- 删除本地已经merge的分支：git branch -d branchName
- 强制删除本地分支：git branch -D branchName
- 清理已经合并的，包含‘bugfix’的本地分支：
  git branch --merged | grep 'bugfix' | xargs git branch -d

- 删除远程分支
  git push origin :branchName
  git push --delete origin branchName
- 清理无效的远程追踪分支
  查看哪些分支会被删除：git remote prune origin --dry-run
  删除：git remote prune origin

- 查看git历史：
  git log --pretty="%h - %ad - %s" --author=zhangyujie --since="2019-01-01"
