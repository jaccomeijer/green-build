export const getMenuItems = ({ pages }) => {

  // Add frontmatter data to page list
  const menuItems = pages

    // Only use pages with frontmatter.navigation.heading
    .filter(page => page.frontmatter.navigation?.heading)

    .map(page => {
      const frontmatter = page.frontmatter
      const navigation = frontmatter.navigation

      const heading = navigation?.heading
      const icon = navigation.icon
      const navigationId = navigation.navigationId
      const order = navigation.order
      const parentHeading = navigation.parent
      let url = page.url

      // When frontmatter.navigation.navigationId is present, use the url of the
      // the page that has the frontmatter.navigation.id set.
      if (frontmatter.navigation.navigationId) {
        const pageWithId = pages.find(p => p.frontmatter.navigation.id === navigationId)

        if (pageWithId) {
          url = pageWithId.url
        } else {
          console.log(`Warning: Could not find a page with frontmatter.navigation.id === '${navigationId}'`)
        }
      }

      return {
        heading,
        icon,
        navigationId,
        order,
        parentHeading,
        url,
      }
    })

  const menuItemsByHeading = menuItems.reduce((prev, current) => {
    if (current.heading) {
      prev[current.heading] = current
    }
    return prev
  }, {})

  // Move entries with a parent to a children array
  const nestedMenuItems = []

  for (const menuItem of menuItems) {
    if (menuItem.parentHeading) {
      const parentMenuItem = menuItemsByHeading[menuItem.parentHeading]

      if (!parentMenuItem) {
        console.log(`Could not find parent with frontmatter.navigation.heading '${menuItem.parentHeading}'`)
        continue
      }
      if (!Array.isArray(parentMenuItem.children)) {
        parentMenuItem.children = []
      }
      parentMenuItem.children.push(menuItem)
    } else {
      nestedMenuItems.push(menuItem)
    }
  }

  const alphaSort = (a, b) => {
    const headingA = a.heading || ''
    const headingB = b.heading || ''

    return headingA.localeCompare(headingB)
  }
  const numberSort = (a, b) => {
    const numberA = a.order || 999
    const numberB = b.order || 999

    return numberA - numberB
  }

  // Sort main items alphabetically and then by number
  nestedMenuItems.sort(alphaSort)
  nestedMenuItems.sort(numberSort)

  // Sort child items alphabetically and then by number
  nestedMenuItems.forEach(item => {
    if (!item.children) {
      return
    }
    item.children.sort(alphaSort)
  })
  nestedMenuItems.forEach(item => {
    if (!item.children) {
      return
    }
    item.children.sort(numberSort)
  })

  return nestedMenuItems
}
