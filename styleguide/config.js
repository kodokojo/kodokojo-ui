import { configure } from '@kadira/storybook'

function loadStories() {
  // components
  require('../src/scripts/components/app/App.component.story')
  require('../src/scripts/components/app/AppHeader.component.story')
  require('../src/scripts/components/user/User.component.story')
  require('../src/scripts/components/brick/Brick.component.story')
  require('../src/scripts/pages/FirstProject.page.story')
  require('../src/scripts/components/menu/MenuItem.component.story')
  require('../src/scripts/components/menu/Menu.component.story')
  require('../src/scripts/pages/Organisations.page.story')
  require('../src/scripts/pages/Signup.page.story')
  require('../src/scripts/pages/Login.page.story')
  require('../src/scripts/pages/Members.page.story')
  require('../src/scripts/pages/Stacks.page.story')
}

configure(loadStories, module)
