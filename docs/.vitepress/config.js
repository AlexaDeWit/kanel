export default {
  title: 'Kanel',
  description: 'Just playing around.',
  themeConfig: {
    sidebar: [
      {
        text: 'Intro',
        items: [
          { text: 'Getting Started', link: '/getting-started' },
          { text: 'How to work with Kanel', link: '/workflow' },
          { text: 'Migrating from V2', link: '/migration' },
        ],
      },
      {
        text: 'Configuration',
        items: [
          {
            text: 'Configuring',
            link: '/configuring',
          },
          {
            text: 'getMetadata',
            link: '/getMetadata',
          },
          { text: 'getPropertyMetadata', link: '/getPropertyMetadata' },
          { text: 'generateIdentifierType', link: '/generateIdentifierType' },
          { text: 'preRenderHooks', link: '/preRenderHooks' },
          { text: 'postRenderHooks', link: '/postRenderHooks' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/kristiandupont/kanel' },
    ],
  },
};
