import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

// ── Tulpar SVG logo ─────────────────────────────────────────────────────────
const TULPAR_LOGO = (
  <svg width="38" height="38" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" fill="url(#tpaint)" stroke="#F2C94C" strokeWidth="4" />
    <path d="M70 140C70 140 60 110 80 90C100 70 130 60 150 50C130 65 125 90 125 90L145 85C145 85 130 110 110 125C90 140 70 140 70 140Z" fill="white" />
    <path d="M85 85C85 85 75 70 90 55C105 40 125 45 125 45C110 50 105 65 105 65" stroke="white" strokeWidth="3" strokeLinecap="round" />
    <defs>
      <linearGradient id="tpaint" x1="100" y1="10" x2="100" y2="190" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2D9CDB" /><stop offset="1" stopColor="#2F80ED" />
      </linearGradient>
    </defs>
  </svg>
);

const PHOTOS = {
  home: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
  news: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1400&q=80',
  tasks: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1400&q=80',
  calendar: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1400&q=80',
  chat: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1400&q=80',
  docs: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1400&q=80',
  staff: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80',
  profile: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1400&q=80',
  login: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80',
};

const T = {
  kz: {
    home: 'Басты бет', news: 'Жаңалықтар', tasks: 'Тапсырмалар', docs: 'Құжаттар',
    calendar: 'Күнтізбе', chat: 'Хабарламалар', staff: 'Қызметкерлер', profile: 'Профиль',
    logout: 'Шығу', loginTitle: 'Жүйеге кіру', loginBtn: 'Кіру',
    checkIn: '📍 Жұмысқа келдім', statsUsers: 'ҚЫЗМЕТКЕРЛЕР', statsTasks: 'ТАПСЫРМАЛАР',
    save: 'Сақтау', send: 'Жіберу', phLogin: 'Логин', phPass: 'Пароль',
    addUser: 'Қызметкер қосу', moto: 'Тұлпардай жүйрік, темірдей төзімді!',
    compInfo: 'Tulpar Portal — компанияның ішкі басқару жүйесі.',
    forgotPass: 'Парольді ұмыттыңыз ба?', backToLogin: 'Кіруге оралу',
    resetTitle: 'Парольді қалпына келтіру', resetBtn: 'Жіберу', resetEmail: 'Email енгізіңіз',
    resetSent: 'Сілтеме жіберілді! Поштаңызды тексеріңіз.',
    addTask: 'Тапсырма қосу', taskTitle: 'Тапсырма атауы', taskDesc: 'Сипаттама',
    taskPriority: 'Басымдық', taskAssign: 'Орындаушы',
    high: 'Жоғары', medium: 'Орта', low: 'Төмен',
    noTasks: 'Тапсырмалар жоқ. Бірінші тапсырманы қосыңыз!',
    done: 'Орындалды', inprogress: 'Орындалуда', todo: 'Жоспарда',
    changePhoto: 'Фотоны өзгерту', editProfile: 'Профильді өңдеу',
    saveProfile: 'Сақтау', cancelEdit: 'Болдырмау',
    fullName: 'Толық аты', position: 'Лауазымы', phone: 'Телефон',
    addHoliday: 'Демалыс қосу', holidayAdded: 'Демалыс күні қосылды!', removeHoliday: 'Өшіру',
    allHolidays: 'Барлық демалыстар', noHolidays: 'Демалыстар жоқ',
    checkInInfo: 'Жұмысқа келу туралы ақпарат',
    arrivalTime: 'Келу уақыты', workHours: 'Жұмыс уақыты', location: 'Орналасқан жер',
    todayStatus: 'Бүгінгі күй', close: 'Жабу', urgent: 'ШҰҒЫЛ',
    clearChat: 'Чатты тазалау', addNews: 'Жаңалық қосу', newsTitle: 'Тақырыбы', newsContent: 'Мазмұны',
    addContact: 'Контакт қосу', contactName: 'Аты-жөні', contactPhone: 'Email енгізіңіз',
    welcome: 'Қош келдіңіз', welcomeSub: 'Бүгін де жемісті күн болсын!',
    holidayOwner: 'Демалыс алған:', holidayReason: 'Себебі:',
    whoOnLeave: 'Демалыстағылар',
  },
  ru: {
    home: 'Главная', news: 'Новости', tasks: 'Задачи', docs: 'Документы',
    calendar: 'Календарь', chat: 'Сообщения', staff: 'Сотрудники', profile: 'Профиль',
    logout: 'Выйти', loginTitle: 'Вход в систему', loginBtn: 'Войти',
    checkIn: '📍 Я на работе', statsUsers: 'СОТРУДНИКИ', statsTasks: 'ЗАДАЧИ',
    save: 'Сохранить', send: 'Отправить', phLogin: 'Логин', phPass: 'Пароль',
    addUser: 'Добавить сотрудника', moto: 'Быстрые как Тулпар, крепкие как сталь!',
    compInfo: 'Tulpar Portal — внутренняя система управления компанией.',
    forgotPass: 'Забыли пароль?', backToLogin: 'Вернуться ко входу',
    resetTitle: 'Сброс пароля', resetBtn: 'Отправить', resetEmail: 'Введите Email',
    resetSent: 'Ссылка отправлена! Проверьте почту.',
    addTask: 'Добавить задачу', taskTitle: 'Название задачи', taskDesc: 'Описание',
    taskPriority: 'Приоритет', taskAssign: 'Исполнитель',
    high: 'Высокий', medium: 'Средний', low: 'Низкий',
    noTasks: 'Задач нет. Добавьте первую!',
    done: 'Выполнено', inprogress: 'В процессе', todo: 'Запланировано',
    changePhoto: 'Изменить фото', editProfile: 'Редактировать',
    saveProfile: 'Сохранить', cancelEdit: 'Отмена',
    fullName: 'Полное имя', position: 'Должность', phone: 'Телефон',
    addHoliday: 'Добавить выходной', holidayAdded: 'Выходной добавлен!', removeHoliday: 'Удалить',
    allHolidays: 'Все выходные', noHolidays: 'Выходных нет',
    checkInInfo: 'Информация о приходе',
    arrivalTime: 'Время прихода', workHours: 'Рабочие часы', location: 'Местоположение',
    todayStatus: 'Статус', close: 'Закрыть', urgent: 'СРОЧНО',
    clearChat: 'Очистить чат', addNews: 'Добавить новость', newsTitle: 'Заголовок', newsContent: 'Содержание',
    addContact: 'Добавить контакт', contactName: 'Имя', contactPhone: 'Введите Email',
    welcome: 'Добро пожаловать', welcomeSub: 'Пусть сегодня будет продуктивным!',
    holidayOwner: 'В отпуске:', holidayReason: 'Причина:',
    whoOnLeave: 'Кто в отпуске',
  },
  en: {
    home: 'Home', news: 'News', tasks: 'Tasks', docs: 'Documents',
    calendar: 'Calendar', chat: 'Messages', staff: 'Staff', profile: 'Profile',
    logout: 'Logout', loginTitle: 'Login', loginBtn: 'Sign In',
    checkIn: '📍 Check In', statsUsers: 'EMPLOYEES', statsTasks: 'TASKS',
    save: 'Save', send: 'Send', phLogin: 'Username', phPass: 'Password',
    addUser: 'Add Employee', moto: 'Fast as Tulpar, strong as steel!',
    compInfo: 'Tulpar Portal — internal company management system.',
    forgotPass: 'Forgot password?', backToLogin: 'Back to login',
    resetTitle: 'Reset Password', resetBtn: 'Send', resetEmail: 'Enter your Email',
    resetSent: 'Link sent! Check your inbox.',
    addTask: 'Add Task', taskTitle: 'Task Title', taskDesc: 'Description',
    taskPriority: 'Priority', taskAssign: 'Assignee',
    high: 'High', medium: 'Medium', low: 'Low',
    noTasks: 'No tasks yet. Add your first task!',
    done: 'Done', inprogress: 'In Progress', todo: 'To Do',
    changePhoto: 'Change Photo', editProfile: 'Edit Profile',
    saveProfile: 'Save', cancelEdit: 'Cancel',
    fullName: 'Full Name', position: 'Position', phone: 'Phone',
    addHoliday: 'Add Holiday', holidayAdded: 'Holiday added!', removeHoliday: 'Remove',
    allHolidays: 'All Holidays', noHolidays: 'No holidays yet',
    checkInInfo: 'Check-in Information',
    arrivalTime: 'Arrival Time', workHours: 'Work Hours', location: 'Location',
    todayStatus: "Today's Status", close: 'Close', urgent: 'URGENT',
    clearChat: 'Clear Chat', addNews: 'Add News', newsTitle: 'Title', newsContent: 'Content',
    addContact: 'Add Contact', contactName: 'Name', contactPhone: 'Enter Email',
    welcome: 'Welcome', welcomeSub: 'Have a productive day!',
    holidayOwner: 'On leave:', holidayReason: 'Reason:',
    whoOnLeave: 'Who is on leave',
  },
};

const MONTHS = {
  kz: ['Қаңтар', 'Ақпан', 'Наурыз', 'Сәуір', 'Мамыр', 'Маусым', 'Шілде', 'Тамыз', 'Қыркүйек', 'Қазан', 'Қараша', 'Желтоқсан'],
  ru: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
const DAYS = { kz: ['Дс', 'Сс', 'Ср', 'Бс', 'Жм', 'Сн', 'Жк'], ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1; }

const INIT_CONTACTS = {
  'Admin': { id: null, messages: [{ from: 'in', text: 'Сәлем! Мен портал администраторымын. Сұрақтарыңыз болса жазыңыз.', time: '09:00' }], phone: 'admin' },
};

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(sessionStorage.getItem('user')) || null);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'kz');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [activeTab, setActiveTab] = useState('home');
  const [animKey, setAnimKey] = useState(0);

  // Login
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Welcome modal
  const [showWelcome, setShowWelcome] = useState(false);

  // Staff/users
  const [allUsers, setAllUsers] = useState([]);
  const [newUser, setNewUser] = useState({ fullname: '', email: '', password: '', role: 'employee', department: 'IT' });
  const [searchQuery, setSearchQuery] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // News
  const [announcements, setAnnouncements] = useState(() => JSON.parse(localStorage.getItem('tulpar_news')) || []);
  const [showAddNews, setShowAddNews] = useState(false);
  const [newNews, setNewNews] = useState({ title: '', content: '' });

  // Tasks
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tulpar_tasks')) || []);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', desc: '', deadline: '', priority: 'medium', assignee: '' });

  // Calendar
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [holidays, setHolidays] = useState(() => JSON.parse(localStorage.getItem('tulpar_holidays2')) || {});
  const [selectedDay, setSelectedDay] = useState(null);
  const [holidayForm, setHolidayForm] = useState({ label: '', owner: '', reason: '' });
  const [showHolidayList, setShowHolidayList] = useState(false);

  // ── CHAT ─────────────────────────────────────────────────────────────────
  const [contacts, setContacts] = useState(INIT_CONTACTS);
  const [activeChat, setActiveChat] = useState('Admin');
  const [chatInput, setChatInput] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const messagesEndRef = useRef(null);

  // Profile
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const fileInputRef = useRef(null);

  // CheckIn modal
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);

  const t = T[lang];
  const pc = { high: '#ff5b5b', medium: '#ff9f43', low: '#05cd99' };

  // ── Persist ───────────────────────────────────────────────────────────────
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('tulpar_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('tulpar_holidays2', JSON.stringify(holidays)); }, [holidays]);
  useEffect(() => { localStorage.setItem('tulpar_news', JSON.stringify(announcements)); }, [announcements]);

  // ── Profile persist ───────────────────────────────────────────────────────
  useEffect(() => {
    if (profileData && user) {
      localStorage.setItem(`tulpar_profile_${user.id || 0}`, JSON.stringify(profileData));
    }
  }, [profileData, user]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [contacts, activeChat]);

  const navigate = (tab) => { setAnimKey(k => k + 1); setActiveTab(tab); };

  // ── Login болғанда деректерді жүктеу ─────────────────────────────────────
  useEffect(() => {
    if (user) {
      // Profile жүктеу
      const profileKey = `tulpar_profile_${user.id || 0}`;
      const savedProfile = JSON.parse(localStorage.getItem(profileKey));
      if (savedProfile) {
        setProfileData(savedProfile);
      } else {
        setProfileData({ fullname: user.fullname || '', email: user.email || '', position: 'Қызметкер', phone: '', department: user.department || 'IT', avatar: null });
      }

      // ── CHAT: контактілерді DB-дан жүктеу ────────────────────────────────
      axios.get(`http://localhost:5000/api/contacts/${user.id}`)
        .then(res => {
          const loaded = {};
          res.data.contacts.forEach(c => {
            loaded[c.fullname] = {
              id: c.id,
              messages: [],
              phone: c.avatar || '',
              lastMessage: c.lastMessage || '',
              unreadCount: c.unreadCount || 0,
            };
          });
          setContacts({ ...INIT_CONTACTS, ...loaded });
        })
        .catch(() => {
          setContacts(INIT_CONTACTS);
        });

      setActiveChat('Admin');

      // Users жүктеу
      axios.get('http://localhost:5000/api/users').then(r => setAllUsers(r.data)).catch(() => { });

      // Welcome modal
      setShowWelcome(true);
    }
  }, [user]);

  // ── activeChat өзгергенде хабарламаларды DB-дан жүктеу ───────────────────
  useEffect(() => {
    if (!user || !activeChat || !contacts[activeChat]?.id) return;
    const contactId = contacts[activeChat].id;

    const fetchMsgs = () => {
      axios.get(`http://localhost:5000/api/messages/${user.id}?withUser=${contactId}`)
        .then(res => {
          const msgs = res.data.messages.map(m => ({
            from: m.senderId === user.id ? 'out' : 'in',
            text: m.text,
            time: new Date(m.createdAt).toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' }),
          }));
          setContacts(p => ({
            ...p,
            [activeChat]: { ...p[activeChat], messages: msgs, unreadCount: 0 },
          }));
        })
        .catch(() => { });
    };

    fetchMsgs();
    const inv = setInterval(fetchMsgs, 3000);
    return () => clearInterval(inv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat, user]);

  // ── Polling: контактілер мен оқылмаған хабарламаларды жаңарту ────────────
  useEffect(() => {
    if (!user) return;
    const inv = setInterval(() => {
      axios.get(`http://localhost:5000/api/contacts/${user.id}`).then(res => {
         setContacts(p => {
           let changed = false;
           const next = { ...p };
           res.data.contacts.forEach(c => {
             if (!next[c.fullname]) {
               next[c.fullname] = { id: c.id, messages: [], phone: c.avatar || '' };
               changed = true;
             }
             if (next[c.fullname].lastMessage !== (c.lastMessage || '')) {
               next[c.fullname].lastMessage = c.lastMessage || '';
               changed = true;
             }
             const newUnread = (activeChat === c.fullname) ? 0 : (c.unreadCount || 0);
             if (next[c.fullname].unreadCount !== newUnread) {
               next[c.fullname].unreadCount = newUnread;
               changed = true;
             }
           });
           return changed ? next : p;
         });
      }).catch(() => {});
    }, 4000);
    return () => clearInterval(inv);
  }, [user, activeChat]);

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) return;
    try {
      const res = await axios.post('http://localhost:5000/api/login', loginForm);
      sessionStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch { alert('Қате! Логин немесе пароль дұрыс емес.'); }
  };

  // ── PASSWORD RESET ─────────────────────────────────────────────────────────
  const handleReset = async () => {
    if (!resetEmail) return;
    setResetLoading(true);
    try {
      await axios.post('http://localhost:5000/api/reset-password', { email: resetEmail });
    } catch { }
    finally {
      setResetLoading(false);
      setResetSent(true);
    }
  };

  // ── TASKS ──────────────────────────────────────────────────────────────────
  const addTask = () => {
    if (!newTask.title) return;
    setTasks(p => [...p, { id: Date.now(), ...newTask, status: 'todo' }]);
    setNewTask({ title: '', desc: '', deadline: '', priority: 'medium', assignee: '' });
    setShowAddTask(false);
  };
  const changeTaskStatus = (id, s) => setTasks(p => p.map(tk => tk.id === id ? { ...tk, status: s } : tk));
  const deleteTask = (id) => setTasks(p => p.filter(tk => tk.id !== id));

  // ── CALENDAR ───────────────────────────────────────────────────────────────
  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); };
  const dayKey = (d) => `${calYear}-${calMonth}-${d}`;
  const addHoliday = () => {
    if (!selectedDay || !holidayForm.owner) return;
    setHolidays(p => ({ ...p, [dayKey(selectedDay)]: { label: holidayForm.label || t.addHoliday, owner: holidayForm.owner, reason: holidayForm.reason } }));
    setHolidayForm({ label: '', owner: '', reason: '' });
    setSelectedDay(null);
    alert(t.holidayAdded);
  };
  const holidayList = Object.entries(holidays).sort((a, b) => a[0].localeCompare(b[0]));

  // ── CHAT: хабарлама жіберу — DB-ға ───────────────────────────────────────
  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const receiverId = contacts[activeChat]?.id;
    // Admin — DB жоқ, тек local
    if (!receiverId) {
      setContacts(p => ({
        ...p,
        [activeChat]: {
          ...p[activeChat],
          messages: [...(p[activeChat]?.messages || []), {
            from: 'out',
            text: chatInput,
            time: new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' }),
          }],
        },
      }));
      setChatInput('');
      return;
    }
    try {
      const res = await axios.post('http://localhost:5000/api/messages/send', {
        senderId: user.id,
        receiverId,
        text: chatInput.trim(),
      });
      const msg = res.data.message;
      setContacts(p => ({
        ...p,
        [activeChat]: {
          ...p[activeChat],
          messages: [...(p[activeChat]?.messages || []), {
            from: 'out',
            text: msg.text,
            time: new Date(msg.createdAt).toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' }),
          }],
        },
      }));
      setChatInput('');
    } catch (err) {
      console.error('Хабарлама жіберу қатесі:', err);
    }
  };

  // ── CHAT: контакт қосу — DB-ға ────────────────────────────────────────────
  const addContact = async () => {
    if (!newContact.name || !newContact.phone) return;
    // allUsers ішінен email бойынша іздейміз
    const found = allUsers.find(u =>
      u.email === newContact.phone || u.fullname === newContact.name
    );
    if (!found) {
      alert('Қолданушы табылмады! Тіркелген email-ді дұрыс енгізіңіз.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/contacts/add', {
        userId: user.id,
        contactId: found.id,
      });
      setContacts(p => ({
        ...p,
        [found.fullname]: { id: found.id, messages: [], phone: found.email },
      }));
      setActiveChat(found.fullname);
      setNewContact({ name: '', phone: '' });
      setShowAddContact(false);
    } catch (err) {
      console.error('Контакт қосу қатесі:', err);
      alert('Қате: ' + (err?.response?.data?.message || err.message));
    }
  };

  // ── AVATAR ─────────────────────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileData(p => ({ ...p, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  // ── REGISTER ───────────────────────────────────────────────────────────────
  const handleRegister = async () => {
    if (!newUser.fullname || !newUser.email || !newUser.password) { alert('Барлық өрістерді толтырыңыз!'); return; }
    setRegisterLoading(true);
    try {
      await axios.post('http://localhost:5000/api/register', newUser);
      alert('Қызметкер сәтті қосылды! ✅');
      setNewUser({ fullname: '', email: '', password: '', role: 'employee', department: 'IT' });
      const r = await axios.get('http://localhost:5000/api/users');
      setAllUsers(r.data);
    } catch (err) {
      alert('Қате: ' + (err?.response?.data?.message || err.message));
    } finally { setRegisterLoading(false); }
  };

  // ── ADD NEWS ───────────────────────────────────────────────────────────────
  const handleAddNews = () => {
    if (!newNews.title || !newNews.content) return;
    const item = { id: Date.now(), title: newNews.title, content: newNews.content, created_at: new Date().toISOString() };
    setAnnouncements(p => [item, ...p]);
    axios.post('http://localhost:5000/api/announcements', newNews).catch(() => { });
    setNewNews({ title: '', content: '' });
    setShowAddNews(false);
  };

  // ── LOGIN SCREEN ────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="login-wrapper" style={{ backgroundImage: `url(${PHOTOS.login})` }}>
        <div className="login-bg-overlay" />
        <div className="lang-corner">
          <div className="lang-switcher">
            <select value={lang} onChange={e => setLang(e.target.value)}>
              <option value="kz">KZ</option>
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
          </div>
        </div>
        <div className="login-box login-anim">
          <div className="login-logo-row">{TULPAR_LOGO}</div>
          <h2>TULPAR PORTAL</h2>
          <>
            <p>{t.loginTitle}</p>
            <input type="text" placeholder={t.phLogin} value={loginForm.email}
              onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <input type="password" placeholder={t.phPass} value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            <button className="login-submit" onClick={handleLogin}>{t.loginBtn}</button>
          </>
        </div>
      </div>
    );
  }

  if (!profileData) return <div className="loading-screen">{TULPAR_LOGO}<p>Жүктелуде...</p></div>;

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDay(calYear, calMonth);
  const chatList = Object.keys(contacts);

  return (
    <div className="nexus-container">

      {/* ── Welcome modal ── */}
      {showWelcome && (
        <div className="modal-overlay welcome-overlay" onClick={() => setShowWelcome(false)}>
          <div className="modal-box welcome-box" onClick={e => e.stopPropagation()}>
            <div className="welcome-logo">{TULPAR_LOGO}</div>
            <h2 className="welcome-title">{t.welcome}, {profileData.fullname || user.fullname}! 👋</h2>
            <p className="welcome-sub">{t.welcomeSub}</p>
            <div className="welcome-stats">
              <div className="ws-item"><span className="ws-num">{tasks.length}</span><span className="ws-label">Тапсырма</span></div>
              <div className="ws-item"><span className="ws-num" style={{ color: 'var(--success)' }}>{tasks.filter(tk => tk.status === 'done').length}</span><span className="ws-label">Орындалды</span></div>
              <div className="ws-item"><span className="ws-num" style={{ color: '#ff5b5b' }}>{tasks.filter(tk => tk.priority === 'high' && tk.status !== 'done').length}</span><span className="ws-label">Шұғыл</span></div>
            </div>
            <button className="modal-close-btn" onClick={() => setShowWelcome(false)}>{t.close} →</button>
          </div>
        </div>
      )}

      {/* ── CheckIn Modal ── */}
      {showCheckInModal && (
        <div className="modal-overlay" onClick={() => setShowCheckInModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>✅ {t.checkInInfo}</h3>
            <div className="checkin-grid">
              <div className="ci-item"><span className="ci-label">🕐 {t.arrivalTime}</span><span className="ci-val">{checkInTime?.toLocaleTimeString()}</span></div>
              <div className="ci-item"><span className="ci-label">📅 {t.todayStatus}</span><span className="ci-val" style={{ color: 'var(--success)' }}>● Online</span></div>
              <div className="ci-item"><span className="ci-label">⏰ {t.workHours}</span><span className="ci-val">09:00 – 18:00</span></div>
              <div className="ci-item"><span className="ci-label">📍 {t.location}</span><span className="ci-val">Астана, Есіл ауданы</span></div>
              <div className="ci-item"><span className="ci-label">👤</span><span className="ci-val">{profileData.fullname || user.fullname}</span></div>
              <div className="ci-item"><span className="ci-label">🏢 Бөлім</span><span className="ci-val">{profileData.department}</span></div>
            </div>
            <button className="modal-close-btn" onClick={() => setShowCheckInModal(false)}>{t.close}</button>
          </div>
        </div>
      )}

      {/* ── Calendar day modal ── */}
      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>📅 {MONTHS[lang][calMonth]} {selectedDay}, {calYear}</h3>
            {holidays[dayKey(selectedDay)] ? (
              <div>
                <div className="holiday-detail-card">
                  <div className="hdc-row"><span>🎉</span><strong>{holidays[dayKey(selectedDay)].label}</strong></div>
                  <div className="hdc-row"><span>👤 {t.holidayOwner}</span><span>{holidays[dayKey(selectedDay)].owner}</span></div>
                  {holidays[dayKey(selectedDay)].reason && <div className="hdc-row"><span>📝 {t.holidayReason}</span><span>{holidays[dayKey(selectedDay)].reason}</span></div>}
                </div>
                <button className="remove-holiday-btn" style={{ width: '100%', marginTop: 12 }} onClick={() => { const k = dayKey(selectedDay); setHolidays(p => { const n = { ...p }; delete n[k]; return n; }); setSelectedDay(null); }}>🗑 {t.removeHoliday}</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input className="modal-input" type="text" placeholder={t.addHoliday + '...'}
                  value={holidayForm.label} onChange={e => setHolidayForm({ ...holidayForm, label: e.target.value })} />
                <input className="modal-input" type="text" placeholder={t.holidayOwner + ' *'}
                  value={holidayForm.owner} onChange={e => setHolidayForm({ ...holidayForm, owner: e.target.value })} />
                <input className="modal-input" type="text" placeholder={t.holidayReason}
                  value={holidayForm.reason} onChange={e => setHolidayForm({ ...holidayForm, reason: e.target.value })} />
                <button className="login-submit" onClick={addHoliday}>{t.addHoliday}</button>
              </div>
            )}
            <button className="forgot-btn" style={{ marginTop: 10 }} onClick={() => setSelectedDay(null)}>{t.close}</button>
          </div>
        </div>
      )}

      {/* ── Holiday list modal ── */}
      {showHolidayList && (
        <div className="modal-overlay" onClick={() => setShowHolidayList(false)}>
          <div className="modal-box" style={{ maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h3>🏖 {t.whoOnLeave}</h3>
            {holidayList.length === 0 ? (
              <p style={{ color: '#a3aed0' }}>{t.noHolidays}</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {holidayList.map(([key, val]) => {
                  const [y, m, d] = key.split('-');
                  return (
                    <div key={key} className="holiday-existing">
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>{val.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>👤 {val.owner}</div>
                        {val.reason && <div style={{ fontSize: 12, color: '#a3aed0' }}>📝 {val.reason}</div>}
                        <div style={{ fontSize: 11, color: '#a3aed0', marginTop: 2 }}>{MONTHS[lang][parseInt(m)]}, {d} – {y}</div>
                      </div>
                      <button className="remove-holiday-btn" onClick={() => setHolidays(p => { const n = { ...p }; delete n[key]; return n; })}>{t.removeHoliday}</button>
                    </div>
                  );
                })}
              </div>
            )}
            <button className="modal-close-btn" style={{ marginTop: 20 }} onClick={() => setShowHolidayList(false)}>{t.close}</button>
          </div>
        </div>
      )}

      {/* ── Add Contact Modal ── */}
      {showAddContact && (
        <div className="modal-overlay" onClick={() => setShowAddContact(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3>➕ {t.addContact}</h3>
            <p style={{ fontSize: 13, color: '#a3aed0', marginBottom: 8 }}>
              Қолданушының тіркелген email-ін енгізіңіз
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="modal-input" type="text" placeholder={t.contactName}
                value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} />
              <input className="modal-input" type="text" placeholder={t.contactPhone}
                value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} />
              <button className="login-submit" onClick={addContact}>{t.addContact}</button>
            </div>
            <button className="forgot-btn" style={{ marginTop: 10 }} onClick={() => setShowAddContact(false)}>{t.close}</button>
          </div>
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside className="nexus-sidebar">
        <div className="sidebar-brand">
          {TULPAR_LOGO}
          <span>Tulpar Portal</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-group">MANAGEMENT</div>
          {[['home', '🏠'], ['news', '📢'], ['tasks', '📋'], ['docs', '📄'], ['calendar', '📅']].map(([tab, icon]) => (
            <div key={tab} className={`nav-item${activeTab === tab ? ' active' : ''}`} onClick={() => navigate(tab)}>{icon} {t[tab]}</div>
          ))}
          <div className="nav-group">SOCIAL</div>
          {[['chat', '💬'], ['staff', '👥'], ['profile', '👤']].map(([tab, icon]) => (
            <div key={tab} className={`nav-item${activeTab === tab ? ' active' : ''}`} onClick={() => navigate(tab)}>{icon} {t[tab]}</div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => { sessionStorage.clear(); window.location.reload(); }} className="logout-btn-full">{t.logout}</button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="nexus-main">
        <div className="page-hero" style={{ backgroundImage: `url(${PHOTOS[activeTab] || PHOTOS.home})` }}>
          <div className="page-hero-overlay"><h1>{t[activeTab]}</h1></div>
          <div className="hero-header-right">
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="theme-btn">{theme === 'light' ? '🌙' : '☀️'}</button>
            <div className="lang-switcher hero-lang">
              <select value={lang} onChange={e => setLang(e.target.value)}>
                <option value="kz">KZ</option><option value="ru">RU</option><option value="en">EN</option>
              </select>
            </div>
          </div>
        </div>

        <div className="main-body" key={animKey} style={{ animation: 'pageIn .35s ease' }}>

          {/* ── HOME ── */}
          {activeTab === 'home' && (
            <div className="fade-in">
              <div className="stats-grid">
                <div className="stat-card slide-up" style={{ animationDelay: '.05s' }}>
                  <p>{t.statsTasks}</p>
                  <h2>{tasks.filter(tk => tk.status === 'done').length}/{tasks.length || 0}</h2>
                  <div className="progress-bar"><div className="fill" style={{ width: tasks.length ? `${(tasks.filter(tk => tk.status === 'done').length / tasks.length) * 100}%` : '0%' }} /></div>
                </div>
                <div className="stat-card slide-up" style={{ animationDelay: '.1s' }}>
                  <p>{t.statsUsers}</p><h2>{allUsers.length || 1}</h2>
                  <span className="subtitle">Барлық бөлімдер бойынша</span>
                </div>
                <div className="stat-card slide-up" style={{ animationDelay: '.15s' }}>
                  <p>{t.urgent}</p>
                  <h2 style={{ color: '#ff5b5b' }}>{tasks.filter(tk => tk.priority === 'high' && tk.status !== 'done').length}</h2>
                  <span className="subtitle" style={{ color: '#ff5b5b' }}>Шұғыл тапсырмалар</span>
                </div>
                <div className="stat-card slide-up" style={{ animationDelay: '.2s' }}>
                  <p>СТАТУС</p>
                  <h2 style={{ color: 'var(--success)', fontSize: 20 }}>● Online</h2>
                  <span className="subtitle">{profileData.fullname || user.fullname}</span>
                </div>
              </div>
              <div className="info-banner slide-up" style={{ animationDelay: '.25s' }}>
                <div>
                  <h3>{t.moto}</h3>
                  <p>{t.compInfo}</p>
                  <p style={{ fontSize: 13, marginTop: 6, color: '#a3aed0' }}>📍 Астана, Есіл ауданы, «Tulpar Business Center»</p>
                </div>
                <button onClick={() => { setCheckInTime(new Date()); setShowCheckInModal(true); }} className="checkin-btn">{t.checkIn}</button>
              </div>
              {tasks.length > 0 && (
                <div className="card slide-up" style={{ marginTop: 20, animationDelay: '.3s' }}>
                  <h3 style={{ margin: '0 0 15px' }}>Соңғы тапсырмалар</h3>
                  {tasks.slice(-4).reverse().map(tk => (
                    <div key={tk.id} className="task-row-mini">
                      <span className="task-priority-dot" style={{ background: pc[tk.priority] }} />
                      <span className="task-mini-title">{tk.title}</span>
                      {tk.deadline && <span className="task-mini-date">📅 {tk.deadline}</span>}
                      <span className={`task-badge ${tk.status}`}>{t[tk.status]}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── NEWS ── */}
          {activeTab === 'news' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                <button className="btn-primary" onClick={() => setShowAddNews(v => !v)}>
                  {showAddNews ? '✕' : ' + ' + t.addNews}
                </button>
              </div>
              {showAddNews && (
                <div className="card slide-up" style={{ marginBottom: 18 }}>
                  <h3>{t.addNews}</h3>
                  <div className="admin-form">
                    <input type="text" placeholder={t.newsTitle} value={newNews.title}
                      onChange={e => setNewNews({ ...newNews, title: e.target.value })} />
                    <textarea className="task-textarea" rows={4} placeholder={t.newsContent} value={newNews.content}
                      onChange={e => setNewNews({ ...newNews, content: e.target.value })} />
                    <button className="btn-primary" onClick={handleAddNews}>{t.save}</button>
                  </div>
                </div>
              )}
              <div className="card">
                <h3>{t.news}</h3>
                <div className="news-list">
                  {announcements.length > 0 ? announcements.map((a, i) => (
                    <div key={a.id} className="news-item slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                      <h4>{a.title}</h4><p>{a.content}</p>
                      <small>{new Date(a.created_at).toLocaleDateString()}</small>
                    </div>
                  )) : <p style={{ color: '#a3aed0' }}>Жаңалықтар жоқ</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── TASKS ── */}
          {activeTab === 'tasks' && (
            <div className="fade-in">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 15 }}>
                <button className="btn-primary" onClick={() => setShowAddTask(v => !v)}>
                  {showAddTask ? '✕' : ' + ' + t.addTask}
                </button>
              </div>
              {showAddTask && (
                <div className="card slide-up" style={{ marginBottom: 20 }}>
                  <h3>{t.addTask}</h3>
                  <div className="admin-form">
                    <input type="text" placeholder={t.taskTitle} value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                    <textarea placeholder={t.taskDesc} value={newTask.desc} onChange={e => setNewTask({ ...newTask, desc: e.target.value })} className="task-textarea" rows={3} />
                    <div className="form-row">
                      <input type="date" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} />
                      <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                        <option value="high">{t.high}</option><option value="medium">{t.medium}</option><option value="low">{t.low}</option>
                      </select>
                    </div>
                    <input type="text" placeholder={t.taskAssign} value={newTask.assignee} onChange={e => setNewTask({ ...newTask, assignee: e.target.value })} />
                    <button className="btn-primary" onClick={addTask}>{t.save}</button>
                  </div>
                </div>
              )}
              {tasks.length === 0 ? <div className="tasks-placeholder"><p>{t.noTasks}</p></div> : (
                <div className="tasks-columns">
                  {['todo', 'inprogress', 'done'].map(status => (
                    <div key={status} className="task-column">
                      <div className="task-col-header">
                        <span className="task-col-dot" style={{ background: status === 'done' ? '#05cd99' : status === 'inprogress' ? '#ff9f43' : '#a3aed0' }} />
                        {t[status]} ({tasks.filter(tk => tk.status === status).length})
                      </div>
                      {tasks.filter(tk => tk.status === status).map((tk, i) => (
                        <div key={tk.id} className="task-card slide-up" style={{ animationDelay: `${i * 0.07}s` }}>
                          <div className="task-card-header">
                            <span className="task-priority-dot" style={{ background: pc[tk.priority] }} />
                            <strong style={{ flex: 1 }}>{tk.title}</strong>
                            <button className="task-delete-btn" onClick={() => deleteTask(tk.id)}>✕</button>
                          </div>
                          {tk.desc && <p className="task-desc">{tk.desc}</p>}
                          {tk.deadline && <div className="task-meta">📅 {tk.deadline}</div>}
                          {tk.assignee && <div className="task-meta">👤 {tk.assignee}</div>}
                          <div className="task-status-row">
                            {status !== 'todo' && <button className="task-status-btn" onClick={() => changeTaskStatus(tk.id, 'todo')}>{t.todo}</button>}
                            {status !== 'inprogress' && <button className="task-status-btn" onClick={() => changeTaskStatus(tk.id, 'inprogress')}>{t.inprogress}</button>}
                            {status !== 'done' && <button className="task-status-btn done-btn" onClick={() => changeTaskStatus(tk.id, 'done')}>{t.done}</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── CALENDAR ── */}
          {activeTab === 'calendar' && (
            <div className="card fade-in">
              <div className="calendar-header">
                <button onClick={prevMonth}>◀</button>
                <h3 style={{ margin: 0 }}>{MONTHS[lang][calMonth]} {calYear}</h3>
                <button onClick={nextMonth}>▶</button>
                <button className="btn-secondary" style={{ marginLeft: 'auto', padding: '8px 16px', fontSize: 13 }}
                  onClick={() => setShowHolidayList(true)}>
                  🏖 {t.whoOnLeave} ({holidayList.length})
                </button>
              </div>
              <div className="calendar-grid">
                {DAYS[lang].map(d => <div key={d} className="day-name">{d}</div>)}
                {[...Array(firstDay)].map((_, i) => <div key={'e' + i} className="day-cell empty" />)}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1; const key = dayKey(day);
                  const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
                  const hol = holidays[key];
                  return (
                    <div key={day} className={`day-cell${isToday ? ' today' : ''}${hol ? ' holiday-day' : ''}`}
                      onClick={() => setSelectedDay(day)} style={{ cursor: 'pointer' }}>
                      <span className="day-num">{day}</span>
                      {hol && (
                        <div className="event vacation" title={`${hol.owner}: ${hol.reason || ''}`}>
                          👤 {hol.owner}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p style={{ color: '#a3aed0', fontSize: 13, marginTop: 10 }}>💡 Демалыс қосу үшін күнге басыңыз</p>
            </div>
          )}

          {/* ── CHAT ── */}
          {activeTab === 'chat' && (
            <div className="chat-container fade-in">
              <div className="chat-sidebar">
                <div className="chat-search"><input type="text" placeholder="Search..." /></div>
                <button className="add-contact-btn" onClick={() => setShowAddContact(true)}>➕ {t.addContact}</button>
                {chatList.map(name => (
                  <div key={name} className={`chat-user-item${activeChat === name ? ' active' : ''}`} onClick={() => setActiveChat(name)}>
                    <div className="chat-avatar-mini">{name[0].toUpperCase()}</div>
                    <div>
                      <div className="chat-item-name">{name}</div>
                      <div className="chat-item-preview">
                        {contacts[name]?.messages?.slice(-1)[0]?.text?.slice(0, 22) || contacts[name]?.lastMessage?.slice(0, 22) || '...'}
                      </div>
                    </div>
                    {contacts[name]?.unreadCount > 0 && (
                      <span style={{
                        background: '#ff5b5b', color: '#fff',
                        borderRadius: '50%', padding: '2px 7px',
                        fontSize: 11, fontWeight: 700, marginLeft: 'auto'
                      }}>{contacts[name].unreadCount}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="chat-main">
                <div className="chat-top-bar">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="chat-avatar-mini">{activeChat[0].toUpperCase()}</div>
                    <div>
                      <strong>{activeChat}</strong>
                      {contacts[activeChat]?.phone && <div style={{ fontSize: 11, color: '#a3aed0' }}>{contacts[activeChat].phone}</div>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="online-dot">● Online</span>
                    <button className="clear-chat-btn" title={t.clearChat}
                      onClick={() => { if (window.confirm(t.clearChat + '?')) setContacts(p => ({ ...p, [activeChat]: { ...p[activeChat], messages: [] } })); }}>🗑</button>
                  </div>
                </div>
                <div className="messages-area">
                  {(contacts[activeChat]?.messages || []).length === 0 && (
                    <div className="chat-empty"><div className="chat-empty-icon">💬</div><p>{activeChat} {lang === 'kz' ? 'бос' : 'пусто'}</p></div>
                  )}
                  {(contacts[activeChat]?.messages || []).map((msg, i) => (
                    <div key={i} className={`msg-box${msg.from === 'out' ? ' outgoing' : ' incoming'} msg-anim`} style={{ animationDelay: `${i * 0.03}s` }}>
                      <p>{msg.text}</p><span>{msg.time}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="chat-input-row">
                  <label className="attach-btn">📎<input type="file" hidden /></label>
                  <input type="text" placeholder="Type a message..."
                    value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()} />
                  <button className="send-btn" onClick={sendMessage}>{t.send}</button>
                </div>
              </div>
            </div>
          )}

          {/* ── DOCS ── */}
          {activeTab === 'docs' && (
            <div className="card fade-in">
              <h3>{t.docs}</h3>
              <div className="upload-zone">
                <input type="file" id="portalDoc" hidden />
                <label htmlFor="portalDoc" className="upload-label">
                  <div className="upload-icon">📁</div>
                  <p>Файлды осында сүйреңіз немесе таңдаңыз</p>
                  <span>(Максималды мөлшер: 25MB)</span>
                </label>
              </div>
              <div className="recent-docs">
                <h4>Жақында жүктелгендер:</h4>
                <div className="doc-row">📄 report_march.pdf <span>1.2 MB</span></div>
              </div>
            </div>
          )}

          {/* ── STAFF ── */}
          {activeTab === 'staff' && (
            <div className="staff-view fade-in">
              {(user.role === 'admin' || user.role === 'leader') && (
                <div className="card">
                  <h3>{t.addUser}</h3>
                  <div className="admin-form">
                    <input type="text" placeholder="Full Name" value={newUser.fullname} onChange={e => setNewUser({ ...newUser, fullname: e.target.value })} />
                    <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} />
                    <input type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                    <div className="form-row">
                      <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                        <option value="employee">Employee</option><option value="leader">Leader</option><option value="admin">Admin</option>
                      </select>
                      <select value={newUser.department} onChange={e => setNewUser({ ...newUser, department: e.target.value })}>
                        <option value="IT">IT</option><option value="HR">HR</option><option value="Sales">Sales</option>
                      </select>
                    </div>
                    <button className="btn-primary" onClick={handleRegister} disabled={registerLoading}>
                      {registerLoading ? 'Сақталуда...' : t.save}
                    </button>
                  </div>
                </div>
              )}
              <div className="card">
                <div className="list-header">
                  <h3>{t.staff}</h3>
                  <input type="text" placeholder="Search..." className="search-input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="staff-table-header"><span>Name</span><span>Role</span><span>Email</span></div>
                {(allUsers.length > 0 ? allUsers.filter(u => u.fullname?.toLowerCase().includes(searchQuery.toLowerCase())) : [{ id: 0, fullname: user.fullname, role: user.role, email: user.email }]).map((u, i) => (
                  <div key={u.id} className="staff-row-item slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <span>{u.fullname}</span>
                    <span className={u.role === 'admin' ? 'online' : ''}>{u.role}</span>
                    <span>{u.email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {activeTab === 'profile' && (
            <div className="profile-page fade-in">
              <div className="profile-cover">
                <div className="profile-cover-bg" style={{ backgroundImage: `url(${PHOTOS.profile})` }} />
                <div className="profile-cover-overlay" />
                <div className="profile-avatar-section">
                  <div className="avatar-big profile-avatar-lg" onClick={() => fileInputRef.current?.click()}>
                    {profileData.avatar
                      ? <img src={profileData.avatar} alt="avatar" className="avatar-img" />
                      : <span>{(profileData.fullname || user.fullname || 'U')[0].toUpperCase()}</span>
                    }
                    <div className="avatar-overlay">📷</div>
                  </div>
                  <input type="file" accept="image/*" ref={fileInputRef} hidden onChange={handleAvatarChange} />
                  <div className="profile-cover-info">
                    <h2>{profileData.fullname || user.fullname}</h2>
                    <p>{profileData.position || 'Қызметкер'}</p>
                  </div>
                  {!editingProfile && (
                    <button className="profile-edit-cover-btn" onClick={() => setEditingProfile(true)}>✏️ {t.editProfile}</button>
                  )}
                </div>
              </div>
              {!editingProfile ? (
                <div className="profile-body">
                  <div className="profile-stats-strip">
                    <div className="pstat"><span className="pstat-val">{tasks.length}</span><span className="pstat-label">Тапсырма</span></div>
                    <div className="pstat-divider" />
                    <div className="pstat"><span className="pstat-val">{tasks.filter(tk => tk.status === 'done').length}</span><span className="pstat-label">Орындалды</span></div>
                    <div className="pstat-divider" />
                    <div className="pstat"><span className="pstat-val" style={{ color: 'var(--success)' }}>● Online</span><span className="pstat-label">Статус</span></div>
                  </div>
                  <div className="profile-info-grid">
                    <div className="profile-info-card">
                      <div className="pic-header">👤 Жеке ақпарат</div>
                      <div className="pic-row"><span className="pic-icon">🏷</span><div><div className="pic-label">Толық аты</div><div className="pic-val">{profileData.fullname || user.fullname || '—'}</div></div></div>
                      <div className="pic-row"><span className="pic-icon">📧</span><div><div className="pic-label">Email</div><div className="pic-val">{profileData.email || user.email || '—'}</div></div></div>
                      <div className="pic-row"><span className="pic-icon">📱</span><div><div className="pic-label">{t.phone}</div><div className="pic-val">{profileData.phone || '—'}</div></div></div>
                      <div className="pic-row"><span className="pic-icon">🔑</span><div><div className="pic-label">Роль</div><div className="pic-val"><span className="role-badge">{user.role.toUpperCase()}</span></div></div></div>
                    </div>
                    <div className="profile-info-card">
                      <div className="pic-header">🏢 Жұмыс ақпараты</div>
                      <div className="pic-row"><span className="pic-icon">💼</span><div><div className="pic-label">{t.position}</div><div className="pic-val">{profileData.position || '—'}</div></div></div>
                      <div className="pic-row"><span className="pic-icon">🏛</span><div><div className="pic-label">Бөлім</div><div className="pic-val">{profileData.department}</div></div></div>
                      <div className="pic-row"><span className="pic-icon">📍</span><div><div className="pic-label">Офис</div><div className="pic-val">Астана, Есіл ауданы</div></div></div>
                      <div className="pic-row"><span className="pic-icon">⏰</span><div><div className="pic-label">Жұмыс уақыты</div><div className="pic-val">09:00 – 18:00</div></div></div>
                    </div>
                  </div>
                  <button className="change-photo-btn" style={{ alignSelf: 'center' }} onClick={() => fileInputRef.current?.click()}>📷 {t.changePhoto}</button>
                </div>
              ) : (
                <div className="profile-edit-form">
                  <div className="pic-header" style={{ marginBottom: 18 }}>✏️ {t.editProfile}</div>
                  <div className="profile-edit-grid">
                    <div className="pef-group"><label className="pef-label">{t.fullName}</label><input className="pef-input" type="text" value={profileData.fullname} onChange={e => setProfileData({ ...profileData, fullname: e.target.value })} /></div>
                    <div className="pef-group"><label className="pef-label">Email</label><input className="pef-input" type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} /></div>
                    <div className="pef-group"><label className="pef-label">{t.position}</label><input className="pef-input" type="text" value={profileData.position} onChange={e => setProfileData({ ...profileData, position: e.target.value })} /></div>
                    <div className="pef-group"><label className="pef-label">{t.phone}</label><input className="pef-input" type="text" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} /></div>
                    <div className="pef-group"><label className="pef-label">Бөлім</label>
                      <select className="pef-input" value={profileData.department} onChange={e => setProfileData({ ...profileData, department: e.target.value })}>
                        <option value="IT">IT Department</option><option value="HR">HR Department</option><option value="Sales">Sales</option>
                      </select>
                    </div>
                  </div>
                  <div className="pef-actions">
                    <button className="btn-primary" onClick={() => { setEditingProfile(false); alert(t.saveProfile + ' ✅'); }}>✅ {t.saveProfile}</button>
                    <button className="btn-secondary" onClick={() => setEditingProfile(false)}>{t.cancelEdit}</button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}