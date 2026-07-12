/*
  API: GET /settings  — if dev_mode.jokes_enabled, show random joke
  Uses local devWisdom array as fallback.
*/
import Card from "./Card";

function DevWisdom({ quote }) {
  return (
    <Card className="DevWisdom">
      <span className="DevWisdom-icon">💡</span>
      <blockquote className="DevWisdom-quote">{quote}</blockquote>
    </Card>
  );
}

export default DevWisdom;
