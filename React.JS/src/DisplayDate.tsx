import { format } from "date-fns";

function DisplayDate() {
  return <div>Today's Date: {format(new Date(), "do MMMM yyyy")}</div>;
}

export default DisplayDate;