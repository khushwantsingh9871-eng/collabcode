import React, { useState } from 'react'

import {
  LayoutDashboard, FolderKanban, Users, Star, Settings,
  Plus, Search, Bell, ChevronDown, MoreHorizontal,
  Code2, Music2, Globe2, Clock3, X, LogOut, Menu,
  ArrowUpRight,
  Layout
} from "lucide-react";

const initialProject = [
    {
        id: 1,
        name: 'CollabCode',
        description: 'Real-time collaborative code editor',
        tech: 'React',
        members: 3,
        icon: Code2,
        color: "from-blue-500 to-cyan-400",
        glow: "rgba(59,130,246,0.35)",    
        updated: '2 hours',
    },
    {
        id: 2,
        name: "Music Studio",
        description: "Music production portfolio website",
        tech: "Next.js",
        members: 2,
        icon: Music2,
        color: "from-fuchsia-500 to-purple-500",
        glow: "rgba(168,85,247,0.35)",
        updated: "Yesterday",
    },
    {
        id: 3,
        name: "Portfolio Website",
        description: "Personal developer portfolio ",
        tech: "React",
        members: 1,
        icon: Globe2,
        color: "from-orange-400 to-pink-500",
        glow: "rgba(249,115,22,0.3)",
        updated: "3 days ago",
    },
]


function Home({user}) {

  const [projects,setProjects] = useState(initialProject)
  const [activeTab, setActiveTab] = useState("All Projects");
  const [search,setSearch] = useState('')
  const [sidebarOpen,setSidebarOpen] = useState(false)

  const [projectName ,setProjectName] = useState('')
  const [description ,setDescription] = useState('')
  const [createModel,setCreateModel] = useState(false)

  const avatar = user?.photoURL;
  const displayname = user?.username || "Developer"

  const filterProjects = projects.filter((project)=>{
    const matchesSearch =
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description.toLowerCase().includes(search.toLowerCase())

    const matchesTab = 
      activeTab === "All Projects"  ||
      (activeTab ==='My Projects' && project.owner !== 'shared') ||
      (activeTab ==='Shared' && project.owner === 'shared') 

    return matchesSearch && matchesTab;  
  })

  const createProject = (e) => {
      e.preventDefault();
      if (!projectName.trim()) return;
  
      const newProject = {
        id: Date.now(),
        name: projectName,
        description: description || "Your new workspace",
        tech: "React",
        members: 1,
        icon: Code2,
        color: "from-cyan-400 to-blue-600",
        glow: "rgba(34,211,238,0.3)",
        updated: "Just now",
        owner: "me",
      };
  
      setProjects((prev) => [newProject, ...prev]);
      setProjectName("");
      setDescription("");
      setCreateModal(false);
      setActiveTab("All Projects");
    };

  const tabs = ["All Projects", "My Projects", "Shared"];

  const navItems = [
      { label:"Dashboard", icon: LayoutDashboard},
      { label: "My Projects", icon: FolderKanban },
      { label: "Shared with me", icon: Users },
      { label: "Starred", icon: Star },
    ]

  return (
    <div className='text-white'>    
      <div className='relative min-h-screen flex overflow-hidden bg-[#080b18] text-white'>

        {/* background glow */}
          <div className='pointer-events-none fixed inset-0 overflow-hidden'>
            <div className='absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[140px] '> </div>
            <div className='absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[140px] '> </div>
            <div className="absolute bottom-0 left-1/3 h-[350px] w-[450px] rounded-full bg-cyan-500/10 blur-[150px]" />            
          </div>

        {/* close sidebar */}
        <div className='fixed z-10 flex min-h-screen'>
          {sidebarOpen && (
            <div 
            className='fixed inset-0 z-30 bg-black/40 lg:hidden'
            onClick={()=>setSidebarOpen(false)}
            />
          )}
        </div>

        {/* sidebar   */}
        <aside className={`fixed min-h-screen overflow-auto  inset-y-0 z-40 left-0 w-64 flex flex-col p-5 border-r border-white/10 transition-all  bg-[#101426]/90 backdrop-blur-2xl lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${sidebarOpen? "translate-x-0":'-translate-x-full'} 
          `}>

          <div className='flex mb-12 justify-between items-center'>
            <div className='flex items-center gap-3'>
              <div className='bg-gradient-to-br from-blue-500 to-purple-500 w-10 h-10 flex justify-center items-center rounded-xl shadow-lg shadow-blue-500/30'>
                <Code2 size={23}/>
              </div>

            <span className='text-xl font-bold tracking-tight'>Collab<span className='text-blue-400'>Code</span></span>
            </div>
            
            <button className='lg:hidden p-1  ' onClick={()=>(setSidebarOpen(false))}>
              <X size={20}/>
            </button>
          </div>

          <div className='mb-3 px-3 text-xs font-semibold uppercase tracking-[0.2em] duration-300 text-slate-500'>
            Workspace
          </div>

          <nav className='space-y-2'>

            {navItems.map(({label,icon: Icon})=>(
              <button 
              key={label} 
              
              onClick={()=>{
                if (label === 'My Projects') setActiveTab("My Projects")
                  else if(label === 'Shared with me') setActiveTab('Shared')
                else (setActiveTab('All Projects'))
              }}

              className={`w-full group flex items-center text-sm gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                (label ==='Dashboard' &&  activeTab === 'All Projects') ||
                (label === "My Projects"  && activeTab === "My Projects") ||
                (label === "Shared with me" && activeTab === 'Shared')
                ? 'border border-blue-400/20 bg-blue-500/15  text-blue-300 shadow-[inset_0_0_20px_rgba(59,130,246,0.08)]' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'} `}
              >
                <Icon size={19}/>
                {label}
              </button>
            ))}
          </nav>

          <div className="my-7 border-t border-white/10" />

          <div className='mb-3 px-3 text-xs font-semibold uppercase tracking-[0.2em] duration-300 text-slate-500'>
            Preferences
          </div>

            <button 
              
              
              className='w-full  group flex items-center text-sm gap-3 px-3 py-3  rounded-xl duration-300 text-slate-400 hover:bg-white/5 hover:text-white '
              >
                <Settings size={19}/>
                Settings
              </button>

              <button className='mt-auto  border  p-4 rounded-2xl border-blue-400/20 bg-gradient-to-br from-blue-500/15 to-purple-500/10 shadow-xl shadow-blue-900/10'>
                <div className='mb-2 h-9 w-9 bg-blue-500/20 text-blue-300 rounded-xl flex justify-center items-center'>
                  <Users size={19}/>
                </div>
                <h3 className='font-semibold text-start'>
                  Build together
                </h3>
                <p className='mt-1 text-start text-xs leading-5 text-slate-400' >Invite your teammates and start collaborating.</p>
                <button className='flex mt-3 items-center gap-1 text-xs font-semibold text-blue-300 hover:text-white'>
                  Invite teammates <ArrowUpRight size={14}/>
                </button>
              </button>
              


        </aside>

        {/* main content */}
        <main className=' min-w-0 flex-1 p-4 sm:p-7 lg:p-10'>
            
            {/* top nav */}
            <header className='mb-10 flex items-center justify-between gap-4'>
              
              {/* left */}
              <div className='flex min-w-0 flex-1 items-center gap-3'>
                <button 
                onClick={()=>(setSidebarOpen(true))}
                className='bg-white/[0.04] outline-none p-2 border rounded-xl border-white/10 outline-2 focus:border-blue-400/50 focus:bg-white/[0.07] lg:hidden'
                >
                  <Menu size={20}/>
                 </button>
                 <div className='relative hidden max-w-md flex-1 sm:block '>
                  <Search size={18} className='absolute z-10 top-1/2  -translate-y-1/2 left-4 text-slate-400 '/>
                  <input 
                  Placeholder="Search your projects..."
                  onChange={(e)=>setSearch(e.target.value)}
                  className='bg-white/[0.04] outline-none w-full text-sm py-3 pl-11 pr-4 border rounded-xl backdrop-blur-xl text-white border-white/10 outline-2 transition  focus:border-blue-400/50 focus:bg-white/[0.07]' type="text" />
                 </div>
                
              </div>

              {/* right */}
              <div className='flex gap-4 items-center'>
              <button className='bg-white/[0.04] outline-none p-3 border border-white/10 text-slate-300 outline-2 rounded-xl'>
                <Bell size={18}/>
              </button>

              <div className='flex items-center gap-4  rounded-xl  border p-2 border-white/10 bg-white/[0.04]'>
                <div>
                  {avatar? (
                    <img src={avatar} alt="" />
                  ):
                  <div className='h-9 w-9 rounded-full font-bold bg-gradient-to-br from-blue-500 to-purple-500 flex justify-center items-center '>
                    {displayname[0]}
                </div>
                  }
                </div>
                <div className='max-w-32 truncate text-sm font-medium'>{displayname}</div>
                <div className='mt-1 text-slate-300'>
                  <LogOut size={17}/>
                </div>
              </div>
              </div>

            </header>

            {/* welcome */}
            <section className='mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
              <div >
                  <p className='mb-2 text-sm font-medium text-blue-400'>
                    YOUR WORKSPACE
                  </p>
                  <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                    Welcome back,{' '}
                    <span className='bg-gradient-to-br from-purple-300 to-blue-400 bg-clip-text text-transparent'>
                      {displayname.split(' ')[0]}
                    </span>
                  </h1>
                  <p className='mt-2 text-sm text-slate-400 sm:text-base'>
                    Your ideas are waiting to become reality.
                  </p>
              </div>

              <button 
                onClick={()=>setCreateModel(true)}
                className='flex group items-center gap-2 justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold shadow-[0_8px_30px_rgba(59,130,246,0.25)]  transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(59,130,246,0.4)]'>
                <Plus       
                  size={19} 
                  className='transition-all group-hover:rotate-90'/>
                New Project
              </button>
            </section>

            {/* Starts */}
            <section className='mb-10 grid grid=col-1 sm:grid-cols-3 gap-4'>

              {[
                {
                 label: 'Total Projects',
                 value: projects.length,
                 icon: FolderKanban,
                 color : 'text-blue-300',
                 bg: 'bg-blue-500/15'
                },
                {
                 label: "Collaborators",
                 value: projects.reduce((sum, p) => sum + p.members, 0),
                 icon: Users,
                 color: "text-purple-300",
                 bg: "bg-purple-500/15",
                },
                {
                 label: "Active Projects",
                 value: projects.length,
                 icon: Clock3,
                 color: "text-cyan-300",
                 bg: "bg-cyan-500/15",
               },
              ].map(({ label,value,icon:Icon,color,bg})=>(

                <div
                key={label}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.15)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{label}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                  </div>
                  <div className={`rounded-xl ${bg} p-3 ${color}`}>
                    <Icon size={22} />
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-400/20 " />
              </div>
              ))
              }
              
              
            </section>

            {/* Projects   */}
            <section>
              {/* Your Project */}
              <div className='flex mb-5 flex-col sm:flex-row gap-4 justify-between sm:items-center'>
                <div>
                  <h2 className='text-xl font-bold'>Your Projects</h2>
                  <p className='text-sm mt-1 text-slate-500'>
                    Manage and continue your work
                  </p>
                </div>
                <div className='flex overflow-x-auto rounded-xl border border-white/10 bg-white/[0.035] p-1'>
                  {tabs.map((tab)=>(
                    <button
                      key={tab}

                      onClick={()=>{
                        setActiveTab(tab)
                      }}

                      className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transtion sm:text-sm ${
                        activeTab === tab 
                        ? 'bg-blue-500/20 text-blue-300 shad-inner'
                        :' text-slate-400 hover:text-white'
                      } `}
                    >
                      {tab}
                    </button>
                  ))

                  }
                </div>
              </div>

              {/* Mobile search */}
                <div className="relative mb-5 sm:hidden">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400/50"
                  />
                </div>

              {/* list */}
              
              <div className='grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                  {filterProjects.map((project)=>{

                    const Icon = project.icon;

                    return(  
                   <article 
                        key={project.id}
                        className='p-5 group  rounded-2xl relative overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.025] shadow-[0_15px_40px_rgba(0,0,0,0.2)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:rotate-[0.5deg]'>
                         
                          {/* glow */}
                          <div className='absolute pointer-events-none -right-12 -top-12 h-40 w-40  rounded-full opacity-0 b blur-[55px] transtion duration-300 group-hover:opacity-100' style={{ background: project.glow }}></div>

                          {/* top */}
                          <div className={`h-36 relative mb-5 rounded-2xl border border-white/10  flex bg-[#0c1225] justify-center items-center `}>
                            
                            <div 
                            className={`absolute rounded-2xl inset-0 bg-gradient-to-br ${project.color} opacity-[0.12] transition duration-500 group-hover:opacity-25`}>
                            </div>

                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_70%)]" />



                            <div className={`relative h-20  w-20 flex justify-center items-center border rounded-2xl border-white/20 bg-gradient-to-br ${project.color} duration-500 shadow-2xl [transform:rotateX(12deg)_rotateY(-25deg)] group-hover:scale-110 group-hover:[transform:rotateX(0deg)_rotateY(0deg)]`}
                              style={{ boxShadow: `0 20px 50px ${project.glow}` }}
                              >
                              <Icon className='text-white drop-shadow-lg' size={35}/>
                            </div>

                            <button className='border border-white/10 p-2 top-3 right-3 absolute rounded-lg bg-black/30 text-slate-300 backdrop-blur-xl transtion hover:bg-white/15'>
                              <MoreHorizontal size={18}/>
                            </button>
                          </div>

                          {/* bottom */}
                          <div>
                            <div>
                              <div className='flex justify-between items-start'>
                                <h1 className='font-semibold text-lg transition group-hover:text-blue-300  '>
                                  {project.name}</h1>
                                <span className={`rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-slate-400 text-[10px] `}>
                                  {project.tech}</span>
                              </div>
                            </div>
                            <div>
                              <p className= 'mt-2 leading-5 min-h-10 text-sm text-slate-400'>{project.description}</p>
                            </div>

                            <div className='flex mt-5 pt-4 justify-between border-t border-white/10'  >
                              <div className='flex items-center gap-2 text-slate-400 text-xs text-'>
                                <Users size={15}/>
                                {project.members}{' '}
                                {project.members === 1 ? 'member':'members'}

                              </div>

                              <div className='flex gap-1 items-center text-xs text-slate-500'>
                                <Clock3 size={13}/>
                                {project.updated}
                              </div>
                            </div>
                          </div>
                      </article>
                   )
                  })}

                  {/* create new project */}
                  <button 
                      onClick={()=>setCreateModel(true)}

                    className='group flex justify-center items-center flex-col min-h-[300px] border rounded-2xl border-dashed border-white/20 bg-white/[0.02] transtion duration-300 hover:-translate-y-1 hover:border-blue-400/60 hover:bg-blue-500/[0.04]'>

                    <div className=' mb-4 h-16 w-16 flex justify-center items-center border rounded-2xl bg-white/5 border-white/10 text-slate-400 transtion duration-300 group-hover:rotate-90 group-hover:border-blue-400/30 group-hover:bg-blue-500/15 group-hover:text-blue-300'>
                      <Plus size={30}/>
                    </div>
                    <h3 className='font-semibold text-slate-300 group-hover:text-white'>
                      Create New Project

                    </h3>
                    <p className='mt-2 text-xs text-slate-500'>
                      Start something amazing with your team

                    </p>
                  </button>

              </div>
              {filterProjects.length === 0 && (
                <div className="py-10 text-center text-sm text-slate-500">
                No projects found.
                </div>
              )}
            </section>
        </main>

      </div>

      {/* create project */}
      {createModel &&
        <div 
        onMouseDown={(e)=>{
          if(e.target === e.currentTarget) setCreateModel(false)
        }}
        className='fixed p-4 inset-0 flex justify-center items-center backdrop-blur-md bg-black/70 z-50'>
          <form onSubmit={createProject} className='w-full max-w-md rounded-2xl border border-white/15 bg-[#141a2e] p-6 shadow-[0_25px_100px_rgba(0,0,0,0.6]'>

            <div className='mb-6 flex items-center justify-between'>

              <div >
                <h2 className='font-bold'>Create a Project</h2>
                <p className='mt-1 text-sm text-slate-400'>Give your next idea a name</p>
              </div>
              <button>
                <X size={20}/>
              </button>

            </div>

            <label className='mb-2 block text-sm text-slate-400' >
              Project name      
            </label>
            <input 
              autoFocus
              value={projectName}
              onChange={(e)=>setProjectName(e.target.value)}
              placeholder='e.g My awesome app'
              required
              className='mb-5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-400/60'
            />

            <label className='mb-2 block text-sm text-slate-300'>
              Description             
            </label>
            <input             
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              placeholder='what are you building'
              rows={3}
              className='mb-6 w-full  resize-none rounded-xl border border-white/10  bg-white/5 px-4 py-3 text-sm outline-none trantion placeholder:text-slate-600 focus:border-blue-400/60'
            />

            <div className='flex justify-end'>
              <button 
                type="button"
                onClick={()=>setCreateModel(false)}
                className='rounded-xl px-4 py-3 text-sm text-slate-400 transtion hover:bg-white/s hover:text-white'
              >
                Cancel</button>
              <button
                type='submit'
                className='rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold shadow-lg  shadow-blue-900/30 transtion hover:brightness-110'
              >Create Project</button>
            </div>

          </form>
        </div>
      }
    </div>
  )
}

export default Home
