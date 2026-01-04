const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
  </svg>
)

const OpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
    strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
  </svg>
)

const Sidebar = () => {
  return (
    <div className="grid grid-rows-12 border-r-2 border-amber-400 bg-blue-300 h-full">
      <div className="row-span-2 flex justify-between p-2">
        <img className="rounded-full h-10 w-10" src="/logo.png"></img>
        <CloseIcon/>
      </div>
      <div className="row-span-10"></div>
    </div>
  )
}

export default Sidebar
