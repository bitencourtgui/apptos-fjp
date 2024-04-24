import { subDays, subHours } from 'date-fns';

const now = new Date();

export const notifications = [
  {
    id: '5e8883f1b51cc1956a5a1ec0',
    author: 'João da Silva',
    avatar: '/assets/avatars/avatar-jie-yan-song.png',
    createdAt: subHours(now, 2).getTime(),
    job: 'Assunto',
    read: true,
    type: 'job_add'
  },
  
];
