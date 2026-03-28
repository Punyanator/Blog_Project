import { useState, useEffect, useRef } from "react"
import styles from './Editprofile.module.css'
import editimage from '/src/assets/edit-svgrepo-com.svg'
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "/src/context/CropImage.js";
import useAxios from "./utils/useAxios";

function EditProfile({user,setUser}){
  const api = useAxios();
    const [loading, setloading] =useState(true);
    const [full_name, setName] = useState('');
    const [file,setfile]= useState(null);
    const [pfp_url, setPfp] = useState(user.pfp);
    const [preview, setPreview] = useState(null);
    const [changeselect, setchangeselect] = useState(false);
    const [showconfirmation, setconfirmation] = useState(false);
    const [bio, setBio] = useState('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const fileInputRef = useRef(null);

const clearFile = () => {
  fileInputRef.current.value = "";
};

  const croppedAreaRef = useRef(null);

const onCropComplete = (croppedArea, croppedAreaPixels) => {
  croppedAreaRef.current = croppedAreaPixels;
};
const handleSave = async () => {
  const croppedBlob = await getCroppedImg(
    preview,
    croppedAreaRef.current
  );
  console.log("Blob:", croppedBlob);
  console.log("Blob type:", croppedBlob?.type);
let Url = URL.createObjectURL(croppedBlob);
setfile(croppedBlob);
console.log("Preview URL:", Url);
setPfp(Url);
setchangeselect(false);
}

        useEffect(
          
                 ()=>{
                
                async function Fetchdata(){
                  try{
                let response  = await api.get('profile/edit/');
                
                setName(response.data.full_name);
                setBio(response.data.bio);
                 setloading(false);
                }
                catch(error){
                   console.log(error.response);       // full response object
                   console.log(error.response?.data); // server's response body
                   console.log(error.message);        
                }}
                Fetchdata();}
              
              ,[loading])

    const handleSubmit = async (e) =>{
        e.preventDefault();
    const formData = new FormData();
    
    formData.append("full_name",full_name);
    formData.append("bio",bio);
    if (file) formData.append("pfp", file, "pfp.jpg");
    
    
       try{
      let response  = await api.post("profile/edit/",formData)
        console.log(response);
        let alertmes = response.data;
        alert(alertmes.message);
        setUser(alertmes.user);
        setfile(null);
        return;
      }
     catch(error){
  console.log(error.response);       // full response object
  console.log(error.response?.data); // server's response body
  console.log(error.message);        
      }
}

const deletePfp = async ()=>{
   try{let response = await api.delete("profile/edit/")
     let alertmes = response.data;
    alert(alertmes.message)  ;
    console.log(alertmes);
    setUser(alertmes.user);
    setPfp(alertmes.user.pfp);

   }
   catch(error){
    console.log(error.response);       // full response object
    console.log(error.response?.data); // server's response body
    console.log(error.message); 
   }

}
    const PfpChange =  (event)=>{
      let x = event.target.files[0];
      let url = URL.createObjectURL(x);
      setchangeselect(true);
      setPreview(url);
      clearFile();
    }
    if(loading){
      return(<p>Loading</p>)
    }
    return(
    
              <form  className={styles.loginform} onClick={()=>{setconfirmation(false)}}  onSubmit={handleSubmit} >
                  <p onClick={()=>console.log(file)} className={styles.headtext}>Edit Profile</p>
                    {changeselect?<div className={styles.cropparent} > <div className={styles.crop} >
                      <Cropper
                        image={preview}
                       
                        crop={crop}
                        zoom={zoom}
                        aspect={1 / 1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        /></div>
                        <input
                        id={styles.zoom}
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.01}
                                    value={zoom}
                                    onChange={(e) => setZoom(e.target.value)}
                                  />
                        <input type="button" onClick={()=>{setchangeselect(false);setPreview(null)}} className={styles.loginbutton} value="Cancel"/>
                        <input type="button" onClick={handleSave} className={styles.loginbutton} value="Done"/></div>:<></>}
                  <div style={{position:"relative"}}>
                   <img src={pfp_url} id={styles.pfp}/>
                  
                  <label data-tooltip="Change Pfp" htmlFor={styles.imagepicker} id={styles.imagepickerlabel} ><img  src={editimage} /></label>
                  <input id={styles.imagepicker} ref={fileInputRef}   type="file"  onChange={(e)=>{PfpChange(e)}}/></div>
                  {user.pfp=='https://res.cloudinary.com/dwukhvmuj/image/upload/v1/media/pfp_images/vrsbd3nlv7cxqgn33tvc.svg'?<></>:<input type="button" value="Delete Pfp" onClick={(e)=>{e.stopPropagation();showconfirmation?setconfirmation(false):setconfirmation(true)}} className={styles.loginbutton} />}
                  <div><label htmlFor="name">Name:</label>
                  <input className={styles.forminput} required  id="name" type="text" value={full_name} onChange={(e)=>{setName(e.target.value)}}/></div>
                  <div><label htmlFor="bio">Bio:</label>
                  <input className={styles.forminput} id="bio" type="text" value={bio} onChange={(e)=>{setBio(e.target.value)}}/></div>
                  
                  <button className={styles.loginbutton}  type="submit">Save</button>
                  {showconfirmation?<div id={styles.deletecon}>
                    <p>Are You Sure</p>
                    <button style={{backgroundColor:"#36732C"}} onClick={()=>{deletePfp(); setconfirmation(false);}}>Yes</button>
                    <button  style={{backgroundColor:"#a92424"}} onClick={()=>{setconfirmation(false)}}>No</button>
                  </div>:<></>}
                   {showconfirmation || changeselect?<div id={styles.overlay}>
                  </div>:<></>}
              </form>
              
              
    )

}
export default EditProfile