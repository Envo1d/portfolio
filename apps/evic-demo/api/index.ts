import AuthModule from '@/repository/modules/auth.module'
import ProjectModule from '@/repository/modules/project.module'
import TaskModule from '@/repository/modules/task.module'
import TeamModule from '@/repository/modules/team.module'
import TimerModule from '@/repository/modules/timer.module'
import TokenModule from '@/repository/modules/token.module'
import UserModule from '@/repository/modules/user.module'

const api = {
  token: new TokenModule(),
  auth: new AuthModule(),
  user: new UserModule(),
  timer: new TimerModule(),
  task: new TaskModule(),
  team: new TeamModule(),
  project: new ProjectModule(),
}

export default api
