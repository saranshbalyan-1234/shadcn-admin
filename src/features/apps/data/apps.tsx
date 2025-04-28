import {
// Discord,
// Docker,
Figma, Github, Gitlab, Mail, BookOpen, FileText, Phone, Slack, CreditCard, Send, Trello, MessageCircleMore, Video } from 'lucide-react';


export const apps = [
  {
    name: 'Telegram',
    logo: <Send />,
    connected: false,
    desc: 'Connect with Telegram for real-time communication.',
  },
  {
    name: 'Notion',
    logo: <FileText />,
    connected: true,
    desc: 'Effortlessly sync Notion pages for seamless collaboration.',
  },
  {
    name: 'Figma',
    logo: <Figma />,
    connected: true,
    desc: 'View and collaborate on Figma designs in one place.',
  },
  {
    name: 'Trello',
    logo: <Trello />,
    connected: false,
    desc: 'Sync Trello cards for streamlined project management.',
  },
  {
    name: 'Slack',
    logo: <Slack />,
    connected: false,
    desc: 'Integrate Slack for efficient team communication',
  },
  {
    name: 'Zoom',
    logo: <Video />,
    connected: true,
    desc: 'Host Zoom meetings directly from the dashboard.',
  },
  {
    name: 'Stripe',
    logo: <CreditCard />,
    connected: false,
    desc: 'Easily manage Stripe transactions and payments.',
  },
  {
    name: 'Gmail',
    logo: <Mail />,
    connected: true,
    desc: 'Access and manage Gmail messages effortlessly.',
  },
  {
    name: 'Medium',
    logo: <BookOpen />,
    connected: false,
    desc: 'Explore and share Medium stories on your dashboard.',
  },
  {
    name: 'Skype',
    logo: <Phone />,
    connected: false,
    desc: 'Connect with Skype contacts seamlessly.',
  },
  // {
  //   name: 'Docker',
  //   logo: <Docker />,
  //   connected: false,
  //   desc: 'Effortlessly manage Docker containers on your dashboard.',
  // },
  {
    name: 'GitHub',
    logo: <Github />,
    connected: false,
    desc: 'Streamline code management with GitHub integration.',
  },
  {
    name: 'GitLab',
    logo: <Gitlab />,
    connected: false,
    desc: 'Efficiently manage code projects with GitLab integration.',
  },
  // {
  //   name: 'Discord',
  //   logo: <Discord />,
  //   connected: false,
  //   desc: 'Connect with Discord for seamless team communication.',
  // },
  {
    name: 'WhatsApp',
    logo: <MessageCircleMore />,
    connected: false,
    desc: 'Easily integrate WhatsApp for direct messaging.',
  },
]
