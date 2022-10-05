import Nav from "./Nav";


function Blog() {


  return (
    <div >
        <Nav />
        <div className="text-center text-2xl p-10">
          This blog was my first full stack project. <p/>
          The code can be found on my <a className="p-0 underline hover:text-custom-green-blue" href="https://github.com/Chappo050">GitHub</a> along with the rest of my projects.
        </div>
    </div>
  );
}

export default Blog;
