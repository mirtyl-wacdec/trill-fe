import { sigil, reactRenderer } from '@tlon/sigil-js'
import {isValidPatp} from "../logic/ob/co";

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
  else if (props.patp.length > 15)
  return (
    <div className="sigil bad-sigil">
      XX
    </div>
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