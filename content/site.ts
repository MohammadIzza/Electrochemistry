/**
 * Site-wide settings: name, navigation, footer and social links.
 *
 * Edit this file to change menus or footer links; every page picks the changes up.
 */
import type { SiteConfig } from '@/lib/types';

const site: SiteConfig = {
  name: 'Research Cluster for Electrochemistry',
  shortName: 'RCEC',
  description:
    'Founded in 2025, the Research Cluster for Electrochemistry at the Faculty of Science and Mathematics, Universitas Diponegoro, advances collaborative research across the electrochemical sciences.',
  /** Canonical public URL, used for share links and calendar invites. */
  url: 'https://electrochemistry.utexas.edu',
  logo: { src: '/images/logo.svg', srcOnDark: '/images/logo-white.svg', width: 3594.2, height: 1069.6 },
  timeZone: 'America/Chicago',

  utilityLink: { label: 'utexas.edu', href: 'https://www.utexas.edu' },

  /**
   * Main menu. Items with `children` open a dropdown; the first child may itself have
   * children to form the "Overview" group shown in the dropdown and the section menu.
   */
  mainNav: [
    {
      label: 'About',
      children: [
        {
          label: 'About Overview',
          href: '/about',
          children: [
            { label: 'Mission and Purpose', href: '/about/mission-and-purpose' },
            { label: 'History', href: '/about/history' },
            { label: 'Contact Information', href: '/about/contact-information' },
            { label: 'Sponsors', href: '/about/sponsors' },
          ],
        },
      ],
    },
    {
      label: 'Research',
      children: [
        {
          label: 'Research Overview',
          href: '/research',
          children: [
            { label: 'Electrocatalysis & Electroanalysis', href: '/research/electrocatalysis-electrochemical-energy-conversion-storage' },
            { label: 'Photoelectrochemistry', href: '/research/photoelectrochemistry-and-fuel-generation' },
            { label: 'Bioelectrochemistry', href: '/research/bioelectrochemistry-sensors' },
            { label: 'Computational Electrochemistry', href: '/research/computational-materials-electrochemistry' },
          ],
        },
      ],
    },
    { label: 'People', href: '/people' },
    { label: 'Facilities', href: '/facilities-overview' },
    { label: 'News', href: '/news' },
    {
      label: 'Funding',
      children: [
        { label: 'Funding Sources', href: '/funding-sources' },
        { label: 'Funding Partners', href: '/funding-partners' },
        { label: 'Fellowships', href: '/fellowships' },
        { label: 'Travel Grants', href: '/travel-grants' },
      ],
    },
    { label: 'Workshops', href: '/events/2025-bard-cec-workshop-electrochemistry' },
    { label: 'Events', href: '/events' },
  ],

  footer: {
    loginUrl: 'https://electrochemistry.utexas.edu/saml_login',
    helpUrl: 'https://help.cns.utexas.edu',
    nav: [
      {
        label: 'About',
        href: '/about',
        children: [
          { label: 'Mission and Purpose', href: '/about/mission-and-purpose' },
          { label: 'History', href: '/about/history' },
        ],
      },
      {
        label: 'Research',
        href: '/research',
        children: [
          { label: 'Bioelectrochemistry', href: '/research/bioelectrochemistry-sensors' },
          { label: 'Computational Electrochemistry', href: '/research/computational-materials-electrochemistry' },
          { label: 'Electrocatalysis & Electroanalysis', href: '/research/electrocatalysis-electrochemical-energy-conversion-storage' },
          { label: 'Photoelectrochemistry', href: '/research/photoelectrochemistry-and-fuel-generation' },
        ],
      },
      { label: 'People', href: '/people' },
      { label: 'Facilities', href: '/facilities-overview' },
      { label: 'News', href: '/news' },
      { label: 'Events', href: '/events' },
      { label: 'Funding', href: '/funding-partners' },
    ],
    social: [
      {
        label: 'Linked In',
        href: 'https://www.linkedin.com/company/100555434/admin/dashboard/',
        icon: 'icon-linkedin-in-brands',
      },
    ],
    copyright: { label: 'The University of Texas at Austin', href: 'https://www.utexas.edu' },
    legalLinks: [
      { label: 'Emergency Information', href: 'https://emergency.utexas.edu' },
      { label: 'Site Policy', href: 'https://www.utexas.edu/site-policies' },
      { label: 'Web Accessibility Policy', href: 'https://www.utexas.edu/web-accessibility-policy' },
      { label: 'Web Privacy Policy', href: 'https://www.utexas.edu/web-privacy-policy' },
    ],
  },
};

export default site;
