import { Router as WouterRouter, Route, Switch } from "wouter";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={NotFound} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
