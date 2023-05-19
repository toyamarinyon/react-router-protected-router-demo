import * as React from "react";
import {
  // Routes,
  // Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { fakeAuthProvider } from "./auth";

const router = createBrowserRouter([{
  path: '/',
    element: <AuthProvider><Layout /></AuthProvider>,
    children: [
      {
        path: '/login',
        // element: <LoginPage />,
        lazy: async() => {
          const {LoginPage} = await import('./Login')
          return {
            Component: LoginPage
          }
        }
      },
      {
        path: '/protected',
        element: <RequireAuth />,
        children: [
          {
            path: '/protected/page-1',
            async lazy() {
               const {ProtectedPage1} = await import('./Protected1')
               return {
                 Component: ProtectedPage1
               }
            }
          },
          {
            path: '/protected/page-2',
            async lazy() {
               const {ProtectedPage2} = await import('./Protected2')
               return {
                 Component: ProtectedPage2
               }
            }
          }
        ]
      }
    ]
}])
export default function AAA () {
  return (
    <RouterProvider router={router} />
  )
}
// export  function App() {
//   return (
//     <AuthProvider>
//       <h1>Auth Example</h1>

//       <p>
//         This example demonstrates a simple login flow with three pages: a public
//         page, a protected page, and a login page. In order to see the protected
//         page, you must first login. Pretty standard stuff.
//       </p>

//       <p>
//         First, visit the public page. Then, visit the protected page. You're not
//         yet logged in, so you are redirected to the login page. After you login,
//         you are redirected back to the protected page.
//       </p>

//       <p>
//         Notice the URL change each time. If you click the back button at this
//         point, would you expect to go back to the login page? No! You're already
//         logged in. Try it out, and you'll see you go back to the page you
//         visited just *before* logging in, the public page.
//       </p>

//       <Routes>
//         <Route element={<Layout />}>
//           <Route path="/" element={<PublicPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route element={<RequireAuth />}>
//             <Route path="/protected/page-1" lazy={async () => import('./Protected1')} />
//             <Route path="/protected/page-2" lazy={() => import('./Protected2')} />
//           </Route>
//         </Route>
//       </Routes>
//     </AuthProvider>
//   );
// }

function Layout() {
  return (
    <div>
      <AuthStatus />

      <ul>
        <li>
          <Link to="/">Public Page</Link>
        </li>
        <li>
          <Link to="/protected/page-1">Protected Page 1</Link>
        </li>
        <li>
          <Link to="/protected/page-2">Protected Page 2</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  );
}

interface AuthContextType {
  user: any;
  signin: (user: string, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

let AuthContext = React.createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = React.useState<any>(null);

  let signin = (newUser: string, callback: VoidFunction) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  let value = { user, signin, signout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}

function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.user) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome {auth.user}!{" "}
      <button
        onClick={() => {
          auth.signout(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
}

function RequireAuth() {
  let auth = useAuth();
  let location = useLocation();
  const [load, setLoad] = React.useState(false)

  return null
  console.log(location)
  React.useEffect(() => {
    setLoad(false)
    setTimeout(() => {

    setLoad(true)
    }, 2000)
  }, [location])

  if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!load) {
    return <div>load</div>
  }

  return <Outlet />;
}



function PublicPage() {
  return <h3>Public</h3>;
}
