import { sigil, reactRenderer } from '@tlon/sigil-js'

interface SigilProps{
patp: string;
size: number;
}
const Sigil = (props: SigilProps) => {
 return (
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