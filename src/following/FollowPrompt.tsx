interface PromptProps{
  username: string
}
export default function({username}: PromptProps){
  return(
  <div className="follow-prompt">
    <p>You appear to not follow ~{username}</p>
    <p>Click below to request access to his feed.</p>
    <button>Please</button>
  </div>
  )
}