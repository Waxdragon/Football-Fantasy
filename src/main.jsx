import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const playerData = [
  // Goalkeepers
  ['raya','David Raya','ARS','GK',5.5,[2,6,3,7,6]],
  ['alisson','Alisson Becker','LIV','GK',5.5,[6,2,6,4,7]],
  ['pickford','Jordan Pickford','EVE','GK',5.0,[3,6,2,9,4]],
  ['vicario','Guglielmo Vicario','TOT','GK',5.0,[2,1,6,3,6]],
  ['onana','André Onana','MUN','GK',5.0,[6,2,1,6,2]],
  // Defenders
  ['saliba','William Saliba','ARS','DEF',6.0,[6,6,2,8,6]],
  ['gabriel','Gabriel Magalhães','ARS','DEF',6.0,[8,2,6,6,8]],
  ['vvd','Virgil van Dijk','LIV','DEF',6.0,[6,8,6,2,6]],
  ['taa','Trent Alexander-Arnold','LIV','DEF',7.0,[8,2,9,4,7]],
  ['gvardiol','Joško Gvardiol','MCI','DEF',5.5,[2,6,6,7,2]],
  ['dias','Rúben Dias','MCI','DEF',5.5,[6,3,6,7,2]],
  ['white','Ben White','ARS','DEF',5.5,[6,6,2,6,6]],
  ['porro','Pedro Porro','TOT','DEF',5.5,[5,2,8,3,6]],
  ['udogie','Destiny Udogie','TOT','DEF',5.0,[1,5,6,1,6]],
  ['konate','Ibrahima Konaté','LIV','DEF',5.0,[6,2,6,4,6]],
  ['trippier','Kieran Trippier','NEW','DEF',5.5,[6,1,2,7,3]],
  ['branthwaite','Jarrad Branthwaite','EVE','DEF',4.5,[6,6,2,4,6]],
  ['romero','Cristian Romero','TOT','DEF',5.0,[2,6,6,2,6]],
  ['dunk','Lewis Dunk','BHA','DEF',4.5,[4,2,6,3,8]],
  ['shaw','Luke Shaw','MUN','DEF',5.0,[2,6,1,4,2]],
  // Midfielders
  ['salah','Mohamed Salah','LIV','MID',12.5,[10,12,8,14,9]],
  ['saka','Bukayo Saka','ARS','MID',10.0,[8,2,10,6,12]],
  ['son','Son Heung-min','TOT','MID',10.0,[2,8,10,2,11]],
  ['palmer','Cole Palmer','CHE','MID',10.5,[12,5,8,15,6]],
  ['kdb','Kevin De Bruyne','MCI','MID',9.5,[3,8,12,7,10]],
  ['foden','Phil Foden','MCI','MID',9.0,[6,11,4,10,8]],
  ['odegaard','Martin Ødegaard','ARS','MID',8.5,[4,3,9,6,8]],
  ['bruno','Bruno Fernandes','MUN','MID',8.5,[7,2,5,9,4]],
  ['rice','Declan Rice','ARS','MID',6.5,[5,6,3,8,5]],
  ['maddison','James Maddison','TOT','MID',7.5,[6,3,8,5,7]],
  ['martinelli','Gabriel Martinelli','ARS','MID',7.0,[3,2,9,4,6]],
  ['luisdiaz','Luis Díaz','LIV','MID',7.5,[5,8,6,3,9]],
  ['gordon','Anthony Gordon','NEW','MID',7.5,[8,3,4,11,5]],
  ['bowen','Jarrod Bowen','WHU','MID',7.5,[6,8,5,7,4]],
  ['rashford','Marcus Rashford','MUN','MID',7.0,[2,6,4,8,3]],
  // Forwards
  ['haaland','Erling Haaland','MCI','FWD',15.0,[13,6,12,8,15]],
  ['watkins','Ollie Watkins','AVL','FWD',9.0,[8,5,9,6,11]],
  ['isak','Alexander Isak','NEW','FWD',8.5,[6,7,2,12,8]],
  ['solanke','Dominic Solanke','TOT','FWD',7.5,[4,10,6,3,9]],
  ['nunez','Darwin Núñez','LIV','FWD',7.5,[5,6,11,2,7]],
  ['jackson','Nicolas Jackson','CHE','FWD',7.0,[7,2,8,6,5]],
  ['havertz','Kai Havertz','ARS','FWD',7.5,[5,4,7,8,6]],
  ['toney','Ivan Toney','BRE','FWD',7.5,[2,7,5,9,4]],
  ['joaopedro','João Pedro','BHA','FWD',5.5,[3,6,8,4,7]],
  ['hojlund','Rasmus Højlund','MUN','FWD',7.0,[2,5,3,8,5]],
  ['nkunku','Christopher Nkunku','CHE','FWD',6.5,[4,2,6,5,8]],
  ['wissa','Yoane Wissa','BRE','FWD',6.0,[6,3,7,5,6]],
  ['mateta','Jean-Philippe Mateta','CRY','FWD',7.0,[4,8,2,7,9]],
  ['calvert','Dominic Calvert-Lewin','EVE','FWD',5.5,[5,6,3,5,6]],
  ['ferguson','Evan Ferguson','BHA','FWD',5.5,[2,3,6,4,5]],
];

// The season is intentionally self-contained: every player has a point total for all 20 stored gameweeks.
// Gameweeks 11–20 are pre-loaded future scores, so clicking ahead never needs a live data connection.
const players = playerData.map(([id,name,club,position,price,points]) => {
  const firstTen = [...points, ...points.map((value, index) => Math.max(1, value + ((id.length + index) % 5) - 2))];
  const lastTen = Array.from({ length: 10 }, (_, index) => Math.max(1, firstTen[index] + ((id.charCodeAt(0) + index * 2) % 7) - 3));
  return { id, name, club, position, price, points: [...firstTen, ...lastTen] };
});
const playerMap = Object.fromEntries(players.map((player) => [player.id, player]));
const gameweeks = Array.from({ length: 20 }, (_, index) => index + 1);
const teams = {
  ARS: { name: 'Arsenal', color: '#e30613' }, LIV: { name: 'Liverpool', color: '#c8102e' }, MCI: { name: 'Man City', color: '#6cabdd' },
  TOT: { name: 'Spurs', color: '#132257' }, CHE: { name: 'Chelsea', color: '#034694' }, MUN: { name: 'Man United', color: '#da291c' },
  NEW: { name: 'Newcastle', color: '#242424' }, EVE: { name: 'Everton', color: '#003399' }, BHA: { name: 'Brighton', color: '#0057b8' },
  AVL: { name: 'Aston Villa', color: '#670e36' }, WHU: { name: 'West Ham', color: '#7a263a' }, BRE: { name: 'Brentford', color: '#e30613' }, CRY: { name: 'Palace', color: '#1b458f' }
};
const users = [
  { id:'alex', name:'Alex Morgan', team:'North London Reds', initials:'AM', color:'orange', squad:['raya','saliba','gabriel','white','saka','salah','palmer','foden','haaland','watkins','isak','pickford','vvd','rice','joaopedro'], starters:['raya','saliba','gabriel','white','saka','salah','palmer','foden','haaland','watkins','isak'] },
  { id:'maya', name:'Maya Chen', team:'The Pressers', initials:'MC', color:'purple', squad:['alisson','taa','gvardiol','porro','son','kdb','odegaard','bruno','nunez','jackson','solanke','vicario','konate','gordon','mateta'], starters:['alisson','taa','gvardiol','porro','son','kdb','odegaard','bruno','nunez','jackson','solanke'] },
  { id:'jordan', name:'Jordan Bell', team:'Bell-end FC', initials:'JB', color:'blue', squad:['pickford','vvd','trippier','romero','luisdiaz','bowen','maddison','rashford','toney','havertz','wissa','onana','dunk','martinelli','ferguson'], starters:['pickford','vvd','trippier','romero','luisdiaz','bowen','maddison','rashford','toney','havertz','wissa'] },
];

function Icon({ name, size=18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    users: <><circle cx="9" cy="8" r="3"/><path d="M3 20c.4-3.4 2.3-5 6-5s5.6 1.6 6 5"/><path d="M16 5.2a3 3 0 0 1 0 5.6M18 15c2.3.6 3.7 2.1 4 4.5"/></>,
    shirt: <><path d="m9 4-5 3-3 4 4 3 2-2v9h10v-9l2 2 4-3-3-4-5-2c-.5 1.2-1.7 2-3 2s-2.5-.8-3-2Z"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    trophy: <><path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0V4Z"/><path d="M7 6H3v2a4 4 0 0 0 4 4M17 6h4v2a4 4 0 0 1-4 4"/></>,
    chart: <><path d="M4 19V5M4 19h17"/><path d="m7 15 3-4 3 2 5-7"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
    chevron: <path d="m7 10 5 5 5-5"/>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>,
    bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.6V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6v-2.6h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V5h2.6v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v2.6H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const initials = (name) => name.split(' ').map((part) => part[0]).slice(0,2).join('');
const sumPoints = (player, gw) => player.points.slice(0, gw).reduce((a,b) => a+b, 0);
const currentPoints = (user, gw) => user.starters.reduce((total, id) => total + playerMap[id].points[gw-1], 0);
const totalPoints = (user, gw) => user.starters.reduce((total, id) => total + sumPoints(playerMap[id], gw), 0);
const formatPrice = (price) => `£${price.toFixed(1)}m`;
const getMatchup = (gw) => {
  const round = (gw - 1) % 3;
  const home = users[round];
  const away = users[(round + 1) % 3];
  const bye = users[(round + 2) % 3];
  const homeScore = currentPoints(home, gw);
  const awayScore = currentPoints(away, gw);
  return { home, away, bye, homeScore, awayScore, winner: homeScore === awayScore ? null : (homeScore > awayScore ? home : away) };
};
const h2hRecord = (userId, throughGw) => gameweeks.slice(0, throughGw).reduce((record, gw) => {
  const fixture = getMatchup(gw);
  if (fixture.bye.id === userId) return record;
  const isHome = fixture.home.id === userId;
  const userScore = isHome ? fixture.homeScore : fixture.awayScore;
  const opponentScore = isHome ? fixture.awayScore : fixture.homeScore;
  if (userScore > opponentScore) return {...record, wins: record.wins + 1};
  if (userScore < opponentScore) return {...record, losses: record.losses + 1};
  return {...record, draws: record.draws + 1};
}, {wins:0, draws:0, losses:0});

function Avatar({ player, large=false }) {
  return <div className={`player-avatar ${large ? 'large' : ''}`} style={{'--club': teams[player.club]?.color || '#52666b'}}>{initials(player.name)}</div>;
}

function App() {
  const [activeUserId, setActiveUserId] = useState('alex');
  const [activeTab, setActiveTab] = useState('Overview');
  const [gameweek, setGameweek] = useState(5);
  const [mobileNav, setMobileNav] = useState(false);
  const [position, setPosition] = useState('All');
  const [query, setQuery] = useState('');
  const [watchlist, setWatchlist] = useState([]);
  const [toast, setToast] = useState('');
  const activeUser = users.find((user) => user.id === activeUserId);
  const gwPoints = currentPoints(activeUser, gameweek);
  const seasonPoints = totalPoints(activeUser, gameweek);

  const standings = useMemo(() => users.map((user) => ({...user, points: totalPoints(user, gameweek), gw: currentPoints(user, gameweek)})).sort((a,b) => b.points-a.points), [gameweek]);
  const filteredPlayers = useMemo(() => players.filter((player) => {
    const matchesPosition = position === 'All' || player.position === position;
    const matchesQuery = `${player.name} ${player.club}`.toLowerCase().includes(query.toLowerCase());
    return matchesPosition && matchesQuery;
  }), [position, query]);

  const changeUser = (id) => { setActiveUserId(id); setActiveTab('Overview'); };
  const showToast = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2200); };

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark"><span></span><span></span><span></span></div><div><strong>fantasy</strong><em>pitch</em></div></div>
      <div className="season-select"><span>SEASON</span><button>2024 / 25 <Icon name="chevron" size={14}/></button></div>
      <nav className="main-nav">
        {[["Overview",'grid'],["My Squad",'shirt'],["Transfers",'arrow'],["League",'trophy']].map(([label,icon]) => <button key={label} className={activeTab === label ? 'active' : ''} onClick={() => {setActiveTab(label); setMobileNav(false);}}><Icon name={icon}/><span>{label}</span>{label==='League' && <small>3</small>}</button>)}
      </nav>
      <div className="sidebar-spacer" />
      <div className="league-card"><div className="league-icon"><Icon name="trophy" size={19}/></div><div><strong>Sunday League</strong><span>3 managers · GW {gameweek}</span></div><button aria-label="League settings"><Icon name="settings" size={16}/></button></div>
      <button className="help-link"><Icon name="info" size={17}/> How to play</button>
      <div className="profile"><div className="profile-avatar">{activeUser.initials}</div><div><strong>{activeUser.name}</strong><span>Manager</span></div><Icon name="chevron" size={15}/></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><span></span><span></span><span></span></button><div className="crumb"><span>Sunday League</span><b>/</b><strong>{activeTab}</strong></div><div className="top-actions"><div className="gw-picker"><span>GAMEWEEK</span><button onClick={() => setGameweek((gameweek % 20)+1)}>GW {gameweek} <Icon name="chevron" size={14}/></button></div><button className="bell" aria-label="Notifications"><span></span>◌</button></div></header>
      <div className="content-wrap">
        <div className="welcome-row"><div><p className="eyebrow">{gameweek > 10 ? 'FUTURE SCORECARD · PRE-LOADED' : gameweek === 5 ? 'MID-SEASON CHECK-IN' : `GAMEWEEK ${gameweek} REVIEW`}</p><h1>{activeTab === 'Overview' ? <>Good evening, <span>{activeUser.name.split(' ')[0]}.</span></> : activeTab}</h1><p className="muted">{gameweek > 10 ? 'Saturday’s points are already queued up for the next head-to-head.' : 'Your league is heating up. Here’s how your squad is doing.'}</p></div><div className="user-switcher">{users.map(user => <button key={user.id} className={activeUserId===user.id ? 'selected' : ''} onClick={() => changeUser(user.id)}><span className={`mini-avatar ${user.color}`}>{user.initials}</span>{user.name.split(' ')[0]}</button>)}</div></div>
        {activeTab === 'Overview' && <Overview user={activeUser} gameweek={gameweek} gwPoints={gwPoints} seasonPoints={seasonPoints} standings={standings} setActiveTab={setActiveTab} setGameweek={setGameweek} showToast={showToast}/>} 
        {activeTab === 'My Squad' && <SquadView user={activeUser} gameweek={gameweek} showToast={showToast}/>} 
        {activeTab === 'Transfers' && <TransfersView user={activeUser} gameweek={gameweek} position={position} setPosition={setPosition} query={query} setQuery={setQuery} watchlist={watchlist} setWatchlist={setWatchlist} showToast={showToast}/>} 
        {activeTab === 'League' && <LeagueView standings={standings} activeUserId={activeUserId} gameweek={gameweek} setGameweek={setGameweek} changeUser={changeUser}/>} 
      </div>
    </main>
    {toast && <div className="toast"><Icon name="check" size={16}/>{toast}</div>}
  </div>;
}

function StatCards({user, gameweek, gwPoints, seasonPoints, standings}) {
  const rank = standings.findIndex((entry) => entry.id === user.id) + 1;
  const trend = [1,2,3,4,5].map((gw) => currentPoints(user, gw));
  return <div className="stat-grid">
    <div className="stat-card featured"><div className="stat-head"><span>GAMEWEEK POINTS</span><span className="live-label"><i></i> STORED</span></div><div className="stat-value">{gwPoints}<small> pts</small></div><div className="stat-foot"><span>GW {gameweek}</span><strong>+{Math.max(0, gwPoints-20)} vs average</strong></div><div className="sparkline">{trend.map((value,i)=><div className="spark-bar" key={i} style={{height:`${Math.max(22,value*2.7)}%`}}><i></i></div>)}</div></div>
    <div className="stat-card"><div className="stat-head"><span>SEASON TOTAL</span><Icon name="chart" size={18}/></div><div className="stat-value">{seasonPoints}<small> pts</small></div><div className="stat-foot"><span>After GW {gameweek}</span><strong className="green">↑ 12.4%</strong></div><div className="stat-line"><span style={{width:'72%'}}></span></div></div>
    <div className="stat-card"><div className="stat-head"><span>LEAGUE RANK</span><Icon name="trophy" size={18}/></div><div className="stat-value">{rank}<sup>rd</sup><small> / 3</small></div><div className="stat-foot"><span>Sunday League</span><strong className={rank===1?'green':''}>{rank===1 ? 'Top of the table' : `${standings[0].points - seasonPoints} pts to 1st`}</strong></div><div className="rank-dots">{standings.map((entry,i)=><i key={entry.id} className={entry.id===user.id?'current':''} style={{left:`${(i/2)*100}%`}}></i>)}</div></div>
  </div>;
}

function HeadToHeadPreview({gameweek, setGameweek, setActiveTab}) {
  const fixture = getMatchup(gameweek);
  return <section className="panel h2h-preview"><div className="h2h-intro"><p className="eyebrow">HEAD-TO-HEAD ARENA</p><h2>Gameweek {gameweek} face-off</h2><span>Round robin · one team has the bye</span></div><div className="h2h-match"><div className={`fight-team ${fixture.winner?.id === fixture.home.id ? 'winner' : ''}`}><span className={`mini-avatar ${fixture.home.color}`}>{fixture.home.initials}</span><strong>{fixture.home.name.split(' ')[0]}</strong><b>{fixture.homeScore}</b></div><span className="versus">VS</span><div className={`fight-team away ${fixture.winner?.id === fixture.away.id ? 'winner' : ''}`}><b>{fixture.awayScore}</b><strong>{fixture.away.name.split(' ')[0]}</strong><span className={`mini-avatar ${fixture.away.color}`}>{fixture.away.initials}</span></div></div><div className="h2h-outcome">{fixture.winner ? <><span className="winner-dot">✦</span><strong>{fixture.winner.name.split(' ')[0]} wins the round</strong></> : <><span className="winner-dot">=</span><strong>Dead heat · draw</strong></>}<small>{fixture.bye.name.split(' ')[0]} has the bye</small></div><div className="h2h-actions"><div className="week-dots">{gameweeks.map((gw) => <button key={gw} className={`${gw === gameweek ? 'active' : ''} ${gw > 10 ? 'future' : ''}`} onClick={() => setGameweek(gw)} aria-label={`Gameweek ${gw}`}>{gw}</button>)}</div><button className="text-button" onClick={() => setActiveTab('League')}>Open full arena <Icon name="arrow" size={15}/></button></div></section>;
}

function Overview({user, gameweek, gwPoints, seasonPoints, standings, setActiveTab, setGameweek, showToast}) {
  const starters = user.starters.map(id => playerMap[id]);
  const bench = user.squad.filter(id => !user.starters.includes(id)).map(id => playerMap[id]);
  return <>
    <StatCards user={user} gameweek={gameweek} gwPoints={gwPoints} seasonPoints={seasonPoints} standings={standings}/>
    <HeadToHeadPreview gameweek={gameweek} setGameweek={setGameweek} setActiveTab={setActiveTab}/>
    <div className="dashboard-grid">
      <section className="panel squad-panel"><div className="panel-heading"><div><p className="eyebrow">THE STARTING XI</p><h2>{user.team}</h2></div><button className="text-button" onClick={() => setActiveTab('My Squad')}>View full squad <Icon name="arrow" size={15}/></button></div><div className="pitch"><div className="pitch-lines"></div><div className="formation-label">3 — 4 — 3</div><div className="pitch-row forwards">{starters.slice(8,11).map(p=><PitchPlayer key={p.id} player={p} gameweek={gameweek}/>)}</div><div className="pitch-row mids">{starters.slice(4,8).map(p=><PitchPlayer key={p.id} player={p} gameweek={gameweek}/>)}</div><div className="pitch-row defs">{starters.slice(1,4).map(p=><PitchPlayer key={p.id} player={p} gameweek={gameweek}/>)}</div><div className="pitch-row keeper">{starters.slice(0,1).map(p=><PitchPlayer key={p.id} player={p} gameweek={gameweek}/>)}</div></div><div className="bench-row"><span>BENCH</span>{bench.slice(0,4).map(p=><div className="bench-player" key={p.id}><Avatar player={p}/><span>{p.name.split(' ').slice(-1)[0]}</span><b>{p.points[gameweek-1]}</b></div>)}</div></section>
      <section className="panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">GAMEWEEK JOURNAL</p><h2>Points story</h2></div><button className="round-button" onClick={() => showToast('All points are pre-loaded for this season')}><Icon name="info" size={17}/></button></div><div className="points-summary"><div><strong>{gwPoints}</strong><span>team points</span></div><div className="summary-divider"></div><div><strong>{Math.max(...starters.map(p=>p.points[gameweek-1]))}</strong><span>best player</span></div><div className="summary-divider"></div><div><strong>{starters.filter(p=>p.points[gameweek-1] >= 8).length}</strong><span>returns</span></div></div><div className="activity-list">{[...starters].sort((a,b)=>b.points[gameweek-1]-a.points[gameweek-1]).slice(0,5).map((p,i)=><div className="activity-item" key={p.id}><Avatar player={p}/><div className="activity-copy"><strong>{p.name}</strong><span>{i===0?'Player of the week':`${teams[p.club]?.name} · ${p.position}`}</span></div><b className={p.points[gameweek-1]>=8?'positive':''}>+{p.points[gameweek-1]}</b></div>)}</div><button className="wide-secondary" onClick={() => setActiveTab('My Squad')}>See all player points <Icon name="arrow" size={15}/></button></section>
    </div>
    <div className="lower-grid"><section className="panel mini-table-panel"><div className="panel-heading"><div><p className="eyebrow">FORM GUIDE</p><h2>Last 5 gameweeks</h2></div><span className="table-note">Your team</span></div><div className="form-chart">{[1,2,3,4,5].map((gw)=><div className="form-col" key={gw}><span>{currentPoints(user,gw)}</span><div className="form-bar"><i style={{height:`${currentPoints(user,gw)/0.9}%`}}></i></div><small>GW {gw}</small></div>)}</div></section><section className="panel league-preview"><div className="panel-heading"><div><p className="eyebrow">SUNDAY LEAGUE</p><h2>Table snapshot</h2></div><button className="text-button" onClick={() => setActiveTab('League')}>Full table <Icon name="arrow" size={15}/></button></div>{standings.map((entry,i)=><div className="table-row" key={entry.id}><span className="rank-number">0{i+1}</span><span className={`mini-avatar ${entry.color}`}>{entry.initials}</span><div className="manager-name"><strong>{entry.name}</strong><small>{entry.team}</small></div><span className="row-form">{i===0?'↑ 1':i===1?'—':'↓ 1'}</span><strong>{entry.points}</strong></div>)}</section></div>
  </>;
}

function PitchPlayer({player, gameweek}) { return <div className="pitch-player"><div className="player-chip"><Avatar player={player} large/><span className="chip-points">{player.points[gameweek-1]}</span></div><strong>{player.name.split(' ').slice(-1)[0]}</strong><small>{player.club}</small></div>; }

function SquadView({user, gameweek, showToast}) {
  const [filter, setFilter] = useState('All');
  const squad = user.squad.map(id=>playerMap[id]).filter(p=>filter==='All'||p.position===filter);
  return <div className="page-panel"><div className="page-toolbar"><div><p className="eyebrow">{user.team.toUpperCase()}</p><h2>Squad selection</h2><p className="muted">15 players · 3 — 4 — 3 formation · {formatPrice(user.squad.reduce((sum,id)=>sum+playerMap[id].price,0))} squad value</p></div><button className="primary-button" onClick={() => showToast('Squad locked for Gameweek '+gameweek)}><Icon name="check" size={16}/> Lock team</button></div><div className="filter-tabs">{['All','GK','DEF','MID','FWD'].map(f=><button key={f} className={filter===f?'active':''} onClick={()=>setFilter(f)}>{f==='All'?'All players':f}</button>)}</div><div className="squad-table"><div className="squad-table-head"><span>PLAYER</span><span>POSITION</span><span>PRICE</span><span>GW {gameweek}</span><span>SEASON</span><span></span></div>{squad.map(p=><div className="squad-table-row" key={p.id}><div className="player-cell"><Avatar player={p}/><div><strong>{p.name}</strong><span>{teams[p.club]?.name}</span></div></div><span className="position-pill">{p.position}</span><span>{formatPrice(p.price)}</span><strong className={p.points[gameweek-1]>=8?'positive':''}>{p.points[gameweek-1]} pts</strong><span>{sumPoints(p, gameweek)} pts</span><button className="row-more" onClick={()=>showToast(`${p.name}: ${sumPoints(p,gameweek)} points so far`)}>•••</button></div>)}</div></div>;
}

function TransfersView({user, gameweek, position, setPosition, query, setQuery, watchlist, setWatchlist, showToast}) {
  return <div className="page-panel transfer-page"><div className="page-toolbar"><div><p className="eyebrow">TRANSFER MARKET</p><h2>Build your best XI</h2><p className="muted">All player data and points are saved before kickoff.</p></div><div className="bank"><span>YOUR BANK</span><strong>£1.5m</strong><small>1 free transfer</small></div></div><div className="transfer-controls"><div className="search-box"><Icon name="search" size={17}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search player or club"/></div><div className="filter-tabs compact">{['All','GK','DEF','MID','FWD'].map(f=><button key={f} className={position===f?'active':''} onClick={()=>setPosition(f)}>{f}</button>)}</div></div><div className="market-grid">{filteredPlayers.map(p=><div className="market-card" key={p.id}><button className={`watch ${watchlist.includes(p.id)?'saved':''}`} onClick={()=>setWatchlist(watchlist.includes(p.id)?watchlist.filter(id=>id!==p.id):[...watchlist,p.id])}><Icon name="star" size={15}/></button><Avatar player={p} large/><div className="market-info"><strong>{p.name}</strong><span>{teams[p.club]?.name} · {p.position}</span></div><div className="market-metrics"><div><small>PRICE</small><b>{formatPrice(p.price)}</b></div><div><small>GW {gameweek}</small><b className="positive">{p.points[gameweek-1]}</b></div><div><small>FORM</small><b>{(p.points.slice(Math.max(0,gameweek-3),gameweek).reduce((a,b)=>a+b,0)/Math.min(3,gameweek)).toFixed(1)}</b></div></div><button className="add-player" onClick={()=>showToast(`${p.name} added to your transfer shortlist`)}><Icon name="plus" size={15}/> Add</button></div>)}</div>{filteredPlayers.length===0&&<div className="empty-state">No players match your search.</div>}</div>;
}

function LeagueView({standings, activeUserId, gameweek, setGameweek, changeUser}) {
  const fixture = getMatchup(gameweek);
  const weeklyRanking = users.map((user) => ({user, points: currentPoints(user, gameweek)})).sort((a,b) => b.points - a.points);
  const winner = weeklyRanking[0];
  const winnerRecord = h2hRecord(winner.user.id, gameweek);
  return <div className="league-page"><div className="league-hero"><div><p className="eyebrow">SUNDAY LEAGUE · 3 MANAGERS · 20 WEEKS</p><h2>The table never lies.</h2><p>Pick any gameweek to replay the fight. Scores are pre-loaded offline.</p></div><div className="cup-art"><div>♛</div><span>EST. 2024</span></div></div><div className="league-content"><section className="panel full-table"><div className="panel-heading"><div><p className="eyebrow">HEAD-TO-HEAD ARENA</p><h2>Gameweek {gameweek} face-off</h2></div><div className="gw-switch"><button onClick={()=>setGameweek(Math.max(1,gameweek-1))}>‹</button><span>GW {gameweek}</span><button onClick={()=>setGameweek(Math.min(20,gameweek+1))}>›</button></div></div><div className="arena-card"><div className="arena-top"><div><strong>{gameweek > 10 ? 'Future scorecard' : 'Final scorecard'}</strong><span>{gameweek > 10 ? 'Saturday’s points are already queued' : 'Round robin · one team has the bye'}</span></div><span className={`status-pill ${gameweek > 10 ? 'future-pill' : ''}`}>{gameweek > 10 ? 'PRE-LOADED' : 'FINAL'}</span></div><div className="arena-battle"><div className={`arena-team ${fixture.winner?.id === fixture.home.id ? 'winner' : ''}`}><span className={`mini-avatar ${fixture.home.color}`}>{fixture.home.initials}</span><strong>{fixture.home.name}</strong><b>{fixture.homeScore}</b></div><div className="arena-vs">VS</div><div className={`arena-team ${fixture.winner?.id === fixture.away.id ? 'winner' : ''}`}><b>{fixture.awayScore}</b><strong>{fixture.away.name}</strong><span className={`mini-avatar ${fixture.away.color}`}>{fixture.away.initials}</span></div></div><div className="arena-meta"><span>BYE: <b>{fixture.bye.name}</b></span><span className="arena-winner">✦ {winner.user.name.split(' ')[0]} came 1st with <b>{winner.points} pts</b></span></div><div className="podium-row">{weeklyRanking.map((entry,index)=><button key={entry.user.id} className={entry.user.id===activeUserId?'active':''} onClick={()=>changeUser(entry.user.id)}><span className="podium-place">{index+1}</span><span className={`mini-avatar ${entry.user.color}`}>{entry.user.initials}</span><span><strong>{entry.user.name.split(' ')[0]}</strong><small>{entry.points} pts</small></span></button>)}</div></div><div className="gameweek-nav"><div><p className="eyebrow">JUMP TO A GAMEWEEK</p><span>GW 11–20 are pre-loaded for Saturday</span></div><div className="gameweek-grid">{gameweeks.map((gw)=><button key={gw} className={`${gw===gameweek?'active':''} ${gw>10?'future':''}`} onClick={()=>setGameweek(gw)}>{gw}</button>)}</div></div><div className="leader-head"><span>#</span><span>MANAGER</span><span>FORM</span><span>GW PTS</span><span>TOTAL</span></div>{standings.map((entry,i)=><button className={`leader-row ${entry.id===activeUserId?'you':''}`} key={entry.id} onClick={()=>changeUser(entry.id)}><span className={`leader-rank rank-${i+1}`}>{i+1}</span><span className={`mini-avatar ${entry.color}`}>{entry.initials}</span><span className="leader-manager"><strong>{entry.name}{entry.id===activeUserId&&<em> YOU</em>}</strong><small>{entry.team}</small></span><span className="leader-form"><i></i><i></i><i></i><i></i><i className={i===2?'muted-dot':''}></i></span><strong>{entry.gw}</strong><strong>{entry.points}</strong></button>)}</section><aside className="panel league-stats"><p className="eyebrow">WEEK {gameweek} STATS</p><h2>By the numbers</h2><div className="league-stat"><span>Gameweek winner</span><strong className="leader-name">{winner.user.name.split(' ')[0]}</strong></div><div className="league-stat"><span>Winning score</span><strong>{winner.points}<small> pts</small></strong></div><div className="league-stat"><span>H2H record</span><strong>{winnerRecord.wins}-{winnerRecord.draws}-{winnerRecord.losses}</strong></div><div className="quote">“Form is temporary. Fixtures are forever.”<small>— The Sunday League handbook</small></div></aside></div></div>;
}

export default App;

createRoot(document.getElementById('root')).render(<App />);
