import { useState, useEffect, useRef } from "react"
import styles from './Editprofile.module.css'
import editimage from '/src/assets/edit-svgrepo-com.svg'
import Cropper from 'react-easy-crop';
import { getCroppedImg } from "/src/context/CropImage.js";
import useAxios from "./utils/useAxios";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "./context/AuthContext";
import { useContext } from "react";

function CreateProfile({user,setUser}){
    const {baseURl} = useContext(AuthContext);
    const navigate = useNavigate();
    const api = useAxios();
    const [loading, setloading] =useState(true);
    const [full_name, setName] = useState('');
    const [file,setfile]= useState(null);
    const [pfp_url, setPfp] = useState('https://res.cloudinary.com/dwukhvmuj/image/upload/v1/media/pfp_images/vrsbd3nlv7cxqgn33tvc.svg');
    const [preview, setPreview] = useState(null);
    const [changeselect, setchangeselect] = useState(false);
    const [showconfirmation, setconfirmation] = useState(false);
    const [bio, setBio] = useState('');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const location = useLocation();
    let name = location.state || {};
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


    const handleSubmit = async (e) =>{
        e.preventDefault();
    const formData = new FormData();
    
    formData.append("full_name",full_name);
    if(bio) formData.append("bio",bio);
    if (file) formData.append("pfp", file, "pfp.jpg");
    let response
    try{ response  = await fetch(`${baseURl}profile/create/${name.id}/`,
            {
      method: "POST",
      body: formData,
    });
    let alertmes = await response.json();
    console.log(alertmes);
  if (response.ok){
    setfile(null);
    navigate('/login')}
  }
    catch(error){
      console.error(error)
      if (response.status==404){
        alert("Profile cant be found")
      }
    
    }
}

const deletePfp = async ()=>{
    await setPfp('https://res.cloudinary.com/dwukhvmuj/image/upload/v1/media/pfp_images/vrsbd3nlv7cxqgn33tvc.svg')

}
    const PfpChange =  (event)=>{
      let x = event.target.files[0];
      let url = URL.createObjectURL(x);
      setchangeselect(true);
      setPreview(url);
    }

    return(
    
              <form  className={styles.loginform} onClick={()=>{setconfirmation(false)}}  onSubmit={handleSubmit} >
                  <p onClick={()=>console.log(file)} className={styles.headtext}>Create Profile</p>
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
                  <input id={styles.imagepicker}   type="file"  onChange={(e)=>{PfpChange(e)}}/></div>
                  {pfp_url=='https://res.cloudinary.com/dwukhvmuj/image/upload/v1/media/pfp_images/vrsbd3nlv7cxqgn33tvc.svg'?<></>:<input type="button" value="Delete Pfp" onClick={(e)=>{e.stopPropagation();showconfirmation?setconfirmation(false):setconfirmation(true)}} className={styles.loginbutton} />}
                  <div><label htmlFor="name">Name:</label>
                  <input className={styles.forminput} required  id="name" type="text" value={full_name} onChange={(e)=>{setName(e.target.value)}}/></div>
                  <div><label htmlFor="bio">Bio:</label>
                  <input className={styles.forminput} id="bio" type="text" value={bio} onChange={(e)=>{setBio(e.target.value)}}/></div>
                  
                  <button className={styles.loginbutton}  type="submit">Save</button>
                  
                  <input type="button" className={styles.loginbutton} value="Next"  onClick={()=>{navigate('/login')}}/>
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
export default CreateProfile