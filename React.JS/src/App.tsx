
import { add, format } from "date-fns";

function App() {
  return (
    <>
  Today's Date: {format(new Date(), "do MMMM yyyy")}
    </>
  )
}

export default App
