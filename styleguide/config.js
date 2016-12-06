import { configure } from '@kadira/storybook'

function loadStories() {
  // ui
  require('../src/scripts/components/_ui/avatar/Avatar.component.story')
  require('../src/scripts/components/_ui/appBar/AppBar.component.story')
  require('../src/scripts/components/_ui/button/Button.component.story')
  require('../src/scripts/components/_ui/button/IconButton.component.story')
  require('../src/scripts/components/_ui/card/Card.component.story')
  require('../src/scripts/components/_ui/checkbox/Checkbox.component.story')
  require('../src/scripts/components/_ui/content/Content.component.story')
  require('../src/scripts/components/_ui/colors/colors.story')
  require('../src/scripts/components/_ui/dialog/Dialog.component.story')
  require('../src/scripts/components/_ui/input/Input.component.story')
  require('../src/scripts/components/_ui/layout/Layout.component.story')
  require('../src/scripts/components/_ui/panel/Panel.component.story')
  require('../src/scripts/components/_ui/nav/Nav.component.story')
  require('../src/scripts/components/_ui/page/Page.component.story')
  require('../src/scripts/components/_ui/toaster/Toaster.component.story')
  require('../src/scripts/components/_ui/typography/typography.story')
  // components
  require('../src/scripts/components/app/App.component.story')
  require('../src/scripts/components/app/AppHeader.component.story')
  require('../src/scripts/components/user/User.component.story')
  require('../src/scripts/components/brick/Brick.component.story')
  require('../src/scripts/pages/FirstProject.page.story')
  require('../src/scripts/components/menu/MenuItem.component.story')
  require('../src/scripts/components/menu/Menu.component.story')
  require('../src/scripts/pages/Signup.page.story')
  require('../src/scripts/pages/Login.page.story')
  require('../src/scripts/pages/Members.page.story')
  require('../src/scripts/pages/Stacks.page.story')
}

configure(loadStories, module)
