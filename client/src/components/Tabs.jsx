import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppWindowIcon, CodeIcon } from "lucide-react"


  export function TabsIcons({setCompiler}) {
    return (
      <Tabs defaultValue="web">
        <TabsList>
          <TabsTrigger value="web" onClick={()=>setCompiler(false)}>
            <AppWindowIcon />
            Web
          </TabsTrigger>
          <TabsTrigger value="compiler" onClick={()=>setCompiler(true)}>
            <CodeIcon/>
            Compiler
          </TabsTrigger>
        </TabsList>
      </Tabs>
    )
  }