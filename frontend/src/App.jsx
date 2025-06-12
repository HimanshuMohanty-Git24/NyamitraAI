// import React from "react";
// import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
// // import FileUpload from "./components/FileUpload";
// import QuestionInput from "./components/QuestionInput";
// import "./components/styles.css";
// import LegalDocumentCreator from "./components/LegalDocumentCreator";
// const App = () => {
//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/" element={
//             <div>
//               <h1>Legal Chatbot</h1>
//               {/* <FileUpload /> */}
//               <QuestionInput />
//               <div>
//                 <Link to="/create-document">
//                   <button className="create-document-button">Create Legal Document</button>
//                 </Link>
//               </div>
//             </div>
//           } />
//           <Route path="/create-document" element={<LegalDocumentCreator />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import QuestionInput from "./components/QuestionInput";
import LegalDocumentCreator from "./components/LegalDocumentCreator";
import PrecedenceFinder from "./components/PrecedenceFinder";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ask-question" element={<QuestionInput />} />
            <Route path="/create-document" element={<LegalDocumentCreator />} />
            <Route path="/find-precedents" element={<PrecedenceFinder />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;