import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Language,StarterCode } from "@/constants"

export function LanguageBox({socket,setLang}) {
    const languages=Object.entries(Language);
  return (
      <NativeSelect onChange={(e)=>{
        setLang(e.target.value);
        console.log('Lang ==>',e.target.value);
        
      }}>
       {languages.map(([language,Commonname])=>(
         <NativeSelectOption key={language} value={language}>{Commonname}</NativeSelectOption>
        ))}
        </NativeSelect>
)
}
