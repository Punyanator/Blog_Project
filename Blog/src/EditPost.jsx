import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from './CreatePost.module.css';
import boldimage from '/src/assets/bold-svgrepo-com.svg';
import italicimage from '/src/assets/italic-svgrepo-com.svg';
import listimage from '/src/assets/list-svgrepo-com.svg';
import addimage from '/src/assets/image-svgrepo-com.svg'
import { ResizableImage } from "./extensions/ResizableImage.jsx";
import Placeholder from '@tiptap/extension-placeholder';
import { useContext } from "react";
import AuthContext from "./context/AuthContext.jsx";
import useAxios from "./utils/useAxios.js";

function EditPost(){
    
     const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      Placeholder.configure({
      placeholder: 'Please Type here...'
    }),
    ],
    onUpdate: ({ editor }) => {
    sessionStorage.setItem("editorcontent",editor.getHTML());
    
    // You can update a React state here if you need to
  },
   

        });
  const api = useAxios();
  const [isbold, setbold] = useState(editor.isActive('bold'));
  const [isitalic, setitalic] = useState(editor.isActive('italic'));
  const [isbullet, setbullet] = useState(editor.isActive('bullet'))
  const [title,setTitle] = useState("");
  const [placeholder,setplaceholder] = useState("");
  const [loading,setloading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  let postid = location.state.postid || null;
    useEffect(
              ()=>{
        const getPost = async ()=>{
            if (editor){
               
                
               let res =  await api.get(`posts/edit/${postid}/`)
              
              setTitle(res.data.title);
                if (!(sessionStorage.getItem("editorcontent"))){
                    editor.commands.setContent(res.data.content);
                    setloading(false);
                }
                else{
                   editor.commands.setContent(sessionStorage.getItem("editorcontent"));
                   setloading(false);
                }
                
                };
              }
                getPost();
              }
              ,[editor])
    
    const handleSubmit = async (e)=>{   
         e.preventDefault();
         if (title==""){
          setplaceholder("Title must be filled");
          return;
          }
       
          const payload = {
        title,
        content: editor.getHTML(),
        };
    
      try{
      let response = await api.post(`posts/edit/${postid}/`, payload);
      alert(response.data.message);
      console.log("Server response:", response.data);
      navigate(`/post/${response.data.datum.id}`);
      }
      catch(error){
          console.log(error.response);       // full response object
  console.log(error.response?.data); // server's response body
  console.log(error.message); 
      }
    }
     
   const ImageUpload = async (e) => {
    e.preventDefault();
  const newFiles = Array.from(e.target.files);
              // Send to Django
  const formData = new FormData();
 if (!newFiles) {
  console.log("no file was given")
  return;}
  newFiles.forEach(file => {
      formData.append("images", file);
  });

   try{ const res = await api.post('upload-image/',formData)
    console.log(res.data)
    const data = res.data.urls;

        // Insert image URL into Tiptap
    data.forEach(url => {
        console.log("we ran this now!", "url:", url)
        if (!editor) {
          console.log("editor doesnt exist");
          return;
        }

        editor.chain().focus().setTextSelection(editor.state.doc.content.size).insertContent({
    
        type: "resizableImage",
        attrs: { src: url }
      }).run();console.log(url);
}   );}
      catch(error){
        onsole.log(error.response);       // full response object
        console.log(error.response?.data); // server's response body
        console.log(error.message);
      }

   }


    if (loading==true){
    return<p>Loading</p>
  }
 return(
     <div className={styles.createpostcontainer}>
        <form className={styles.titlebar}>
           <label htmlFor="title"><i>Title:</i></label>
           <input id="title" className={styles.title} type="text" value={title} placeholder={placeholder} onChange={(e)=>{setplaceholder(null);setTitle(e.target.value)}}/>
         </form>   
       <div className={styles.buttonbar}>
           <button data-tooltip='Bold' className={isbold ? styles.activebtn : ''} onClick={(e) =>{e.stopPropagation(); editor.chain().focus().toggleBold().run(); setbold(editor.isActive('bold'))}}>
             <img src={boldimage}/>
           </button>
           <button data-tooltip='Italic' className={isitalic? styles.activebtn : ''} onClick={(e) =>{e.stopPropagation(); editor.chain().focus().toggleItalic().run();setitalic(editor.isActive('italic'))}}>
             <img src={italicimage}/>
           </button>
           <button data-tooltip='Bullet' className={isbullet ? styles.activebtn : ''} onClick={(e) => {e.stopPropagation();editor.chain().focus().toggleBulletList().run();setbullet(editor.isActive('bulletList'))}}>
             <img src={listimage}/>
           </button>
           <label data-tooltip='File' className={styles.image} htmlFor="imageinput"><img src={addimage}/></label>
           <input id="imageinput" style={{display:"none"}} multiple   type="file" onChange={ImageUpload} />
           <button data-tooltip='Save Post' id={styles.postbutton} onClick={(e)=>{ handleSubmit(e);}}>Post</button>
         </div>
       <EditorContent  className= {styles.tiptap} editor={editor} />
       
       </div>
      
    
 )
}

export default EditPost




