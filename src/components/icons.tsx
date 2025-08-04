
import type { SVGProps } from "react"
import {
  Home,
  ClipboardList,
  Users,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Copy,
  ArrowDownToLine,
  ArrowUpFromLine,
  Languages,
  HelpCircle,
  Loader
} from "lucide-react"

export const Icons = {
  Logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  Home,
  Tasks: ClipboardList,
  Refer: Users,
  Profile: User,
  Settings,
  Logout: LogOut,
  ChevronRight,
  Copy,
  Deposit: ArrowDownToLine,
  Withdraw: ArrowUpFromLine,
  Languages,
  HelpCircle,
  Spinner: Loader,
}
