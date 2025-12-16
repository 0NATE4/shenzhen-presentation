import Intro from './components/Intro';
import ProblemSolution from './components/ProblemSolution';
import Chatbot from './components/Chatbot';
import ResultsComparison from './components/ResultsComparison';

function App() {
  return (
    <div className="snap-container bg-[#0a0a0a] text-white">
      <Intro />
      <ProblemSolution />
      <Chatbot />
      <ResultsComparison />
    </div>
  );
}

export default App;
