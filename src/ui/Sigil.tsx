import { sigil, reactRenderer } from '@tlon/sigil-js'
import {isValidPatp} from "../logic/ob/co";
import comet from "../icons/comet.svg"

interface SigilProps{
patp: string;
size: number;
}
const Sigil = (props: SigilProps) => {
  if (!isValidPatp(props.patp))
  return (
    <div className="sigil bad-sigil">
      X
    </div>
  )
  else if (props.patp.length > 28)
  return (
      <img className="comet-icon" src={comet} alt="" />
  )
  else if (props.patp.length > 15) // moons
  return(
    <>
    {
      sigil({
        patp: props.patp.substring(props.patp.length - 13),
        renderer: reactRenderer,
        size: props.size,
        colors: ['grey', 'white'],
      })
    }
    </>
  )
 else return (
   <>
   {
     sigil({
       patp: props.patp,
       renderer: reactRenderer,
       size: props.size,
       colors: ['black', 'white'],
     })
   }
   </>
 )
}

export default Sigil;