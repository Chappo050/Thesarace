import Nav from "./components/Nav";


function App() {
  

  return (
    <div>
      <Nav />
      <div className="text-whitefont-bold text-center m-10 text-2xl">
        <div>Welcome to ThesauRACE. The fast pace thesauras race game.</div>
        <br />
        <br />
        <div>
          Quickly guess the synonym of the displayed word.
        </div>
        <br />
       
        <br />
        Play <a className="underline hover:text-teal-500" href="/solo">solo</a> or <a className="underline hover:text-teal-500" href="/versus">versus</a> against someone!
      </div>
     
    </div>
  );
}

export default App;
