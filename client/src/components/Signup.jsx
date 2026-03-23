import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignupForm({
  className,
  loading,
  name,
  setName,
  email,
  setEmail,
  setPassword,
  handleSignupWithPassword,
  setLogin,
  handleSocialAuth,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card >
        <CardContent>
          <form onSubmit={handleSignupWithPassword}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Username</FieldLabel>
                <Input id="name" type="text" placeholder="Jhon" value={name}
                    required={true}
                    onChange={(e) => setName(e.target.value)}  />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email or username</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" value={email}
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}  />
              </Field>
              <Field>
                 <div className="grid gap-2">
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required 
              onChange={(e)=>setPassword(e.target.value)}/>
            </div>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? <span>Loading</span> : <span>Signup</span>}
                </Button>
              <p>or</p>
                <Button variant="outline" type="button" onClick={handleSocialAuth}>
                  Register with Google
                </Button>
              <p>or</p>
                <Button variant="outline" type="button">
                  Register with GitHub
                </Button>
                <FieldDescription className="text-center">
                   have an account? <a  className='cursor-pointer' onClick={(e)=>{
                  e.preventDefault()
                  setLogin(true)
                }}>Login</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
