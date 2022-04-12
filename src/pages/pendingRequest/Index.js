import React from 'react'
import { useParams } from "react-router-dom";
import { Container,Row,Col,Card,Button,Modal,Table } from 'react-bootstrap';
import '../../style/order.scss'
import { Url,imgUrl,notImage } from '../../GLOBAL/global';
import axios from 'axios';
import { useHistory,Link} from "react-router-dom";
import dateFormat from 'dateformat';
import Parallax from 'react-rellax';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Buffer} from 'buffer';

var sessionstorage = require('sessionstorage');

export default function Index() {

    let history = useHistory();
    const {id,type} = useParams();
    const [paybtn,setPayBtn] = React.useState(false);
    const [eventList,setEventList] = React.useState({});
    const [campList,setCampList] = React.useState({});
    const [pkgList,setpkgList] = React.useState([]);
    const [pkgData,setPkgData] = React.useState({});
    const [c_id,setc_id] = React.useState();
    const [frame,setFrame] = React.useState(false);
    const [pkgReject,setPkgReject] = React.useState(false);
    const [subOrder,setSubOrder] = React.useState([]);
    const [Order,setOrder] =React.useState({});
    const [subId,setSubId] = React.useState();


    const [image,setImage] = React.useState(); 


    React.useEffect(() => {
        console.log("type",type);
        const token = sessionstorage.getItem("token");
        const customer_id =  sessionstorage.getItem("customerId");
        setc_id(customer_id);

        console.log("token",token)
        console.log('c_id',customer_id);
        console.log("req",window.location.pathname);


        sessionstorage.setItem('request',window.location.pathname);

        const headers ={
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'POST'
          }

        if(customer_id === null)
        {
            history.push('/login');
        }

        else
        {
            if(type==="event")
            {
                    var events = new FormData();
                    events.append("event_id",id);
                    console.log("id",id);
    
                    axios({
                        method: 'post',
                        url: Url+'geteventlist',
                        data: events,
                        headers: headers
                        })
                        .then(function (response) {
                            //handle success
                            console.log("events Api",response.data[0]); 
                            setEventList(response.data[0]);    
                            setTimeout(()=> getOrders("EVENT") ,1000);   
                        })
                        .catch(function (response) {
                            //handle error
                            console.log(response);
                        });
    
            }
    
            // if(type === "campaign")
            // {
                
            //     var camps = new FormData();
            //         camps.append("campaign_id",id);
            //         console.log("id",id);
    
            //         axios({
            //             method: 'post',
            //             url: Url+'getCampaignInfo',
            //             data: camps,
            //             headers: headers
            //             })
            //             .then(function (response) {
            //                 //handle success
            //                 console.log("camps",response.data); 
            //                 setCampList("campain Api",response.data[0]);  
            //                 // setImage("http://connectmedia.gitdr.com/public/"+campList.photo)  
            //                 // console.log("camps 1",campList);  
            //                 // console.log("camps 2",campList[0].photo);  
            //             })
            //             .catch(function (response) {
            //                 //handle error
            //                 console.log(response);
            //             });
    
            // }


            if(type === "package")
            {
                var pkg = new FormData();
                    pkg.append("package_id",id);
                    pkg.append("customer_id",customer_id);
                    console.log("id",id);
    
                    axios({
                        method: 'post',
                        url: Url+'getPackage',
                        data: pkg,
                        headers: headers
                        })
                        .then(function (response) {
                            //handle success
                            console.log("pkg Api",response.data); 
                           setpkgList(response.data.data);
                           setPkgData(response.data.package);

                           setTimeout(()=> getOrders("PACKAGE") ,1000);
                        
                           
                        })
                        .catch(function (response) {
                            //handle error
                            console.log(response);
                        });

                    
   
            }
    
        }

        
      },[ history, id, type]);


      async function getOrders()
      {
        const token = sessionstorage.getItem("token");
        const customer_id =  sessionstorage.getItem("customerId");

        var data = new FormData();
        data.append("customer_id",customer_id);
        data.append("item_id",id);
        data.append("item",type)

        const headers ={
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'POST'
          }

        await axios({
            method: 'post',
            url: Url+'getorderbyid',
            data: data,
            headers: headers
            })
            .then(function (response) {
                //handle success
                console.log("pkg /event order",response.data); 
                setSubOrder(response.data.suborder);
                setOrder(response.data.order);
            
               
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });

      }
    
  return (
    <>
        <Parallax speed={5}>
            <img src={require('../../assets/images/Rectangle 40.png')} alt="bg" width='100%' height={250} style={{
              objectFit:'cover'
          }}/>

        </Parallax>
        

                <Container>
       

                            { type === "campaign" || type === "event"  ? (
                                


                            <>
                                
                                
                                    <div className='vertical-text '>
                                        <p>{type === "event" ?"EVENTS":"CAMPAIGNS"}</p>
                                    </div>

                                <div className='second_section my-5'>

                                        <div className='mx-5 px-2'>
                                            <h2>{campList.camp_type==='MPOST'?"MILLION":"STATIC"}<span className='warning'>POSTS</span></h2>
                                            <p className='font-12'><span >Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </span></p>
                                        </div>


                                    <div className='align-end pt-3'>
                                            < img src={eventList.photo === (undefined || null) ?notImage :'http://connectmedia.gitdr.com/public/'+eventList.photo} alt={eventList.order_id} width='250px' height='600px' style={{height:'500px',width:'420px',borderRadius:'20px'}} className="mx-5 "/>

                                        <div className='font-12 content-end'>
                                                <p> Tittle : <span >{eventList.event_title?eventList.event_title:campList.camp_title}</span></p>

                                                <p>Cost : 
                                                <span >${eventList.event_cost?(eventList.event_cost ):(campList.camp_cost)} </span>
                                                </p>

                                            {type === "event" ? (<>
                                            <p>From Date : {dateFormat(eventList.event_from, "mmmm dS, yyyy") }</p>
                                                <p> To Date : {dateFormat(eventList.event_to, "mmmm dS, yyyy")}</p>
                                                </>):(<>
                                            <p className='underline'> Description </p>
                                            
                                            <p style={{marginTop:'-1rem;'}}><span>{campList.camp_desc?campList.camp_desc.camp_desc:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. "} </span></p>
                                            </>)}

                                            <p>Status : <span className='bold-text green'>{eventList.event_status?eventList.event_status:campList.camp_status} </span></p>
                                 

                                                <div className='space-between'>
                                        
                                                {paybtn || eventList.event_status === "Accepted" ? (<> 
                                                    {/* {!frame &&
                                                    <Button variant="light" className='width-100' onClick={()=>paynow(eventList.event_cost)}>pay Now</Button> } */}

                                                    {frame &&

                                                        <div className='space-between rowdirection'>
                                                        
                                                        <form name="tokenform" id="tokenform"  >

                                                            
                                                            <div className='space-between rowdirection'>
                                                                <input type="text" name='name' placeholder='Account Number' /> 
                                                                <input type="text" name='cardno' placeholder='Card No' className='mx-5 '  />
                                                        
                                                            </div>
                                                                
                                                        
                                                            
                                                        
                                                                <input type="text" name='ex-date' placeholder='expirayDate' className='my-5 ' />

                                                                <input type="text" name='cvv' placeholder='CVV' className='mx-5 ' />  

                                                                <label>Amount : </label> <input type="text" name='amt' value={eventList.event_cost} className='mx-5' />
                                                                
                                                            

                                                            <div className='center-align mt-5'>
                                                                <Button variant="light" className='width-100' onClick={() => paySubmit()} >submit</Button>
                                                            </div>
                                                            
                                                            
                                                        
                                                        </form> 
                                                        </div>
                                                    }
                                                    

                                                

                                                    </>):
                                                    ( eventList.event_status === 'Success' ? '' : (
                                                        <>
                                                        {!pkgReject && <Button variant="light" onClick={()=>accept(eventList.event_cost,type,0)}>Accept</Button>}
                                                            <Button variant="light" onClick={()=>reason()}>Reject</Button>


                                                            </>
                                                        )
                                                    )}
                                                    

                                                    {(pkgReject && <>
                                                        <select name="reason" style={{marginLeft:10}} onClick={()=>reject(eventList.event_cost,type)}>
                                                            <option>Select Reason</option>
                                                            <option value="Not Intrested">Not Intrested</option>
                                                            <option value="Need to Add/Remove features">Need to Add/Remove features</option>
                                                            <option value="Change of mind">Change of mind</option>
                                                            <option value="Decided for alternative product">Decided for alternative product</option>
                                                        
                                                        </select></>)
                                                    
                                                    }

                                                        
                                                </div>

                                        </div>


                                    </div>

                                 </div>

                                 {(paybtn || eventList.event_status === "Accepted") && <div className='row'>
                                        <table className="table table-striped table-light mx-5 my-5 ">
                                            <thead class="thead-dark">
                                                <tr>
                                                    <th scope="col">Bill Id</th>
                                                    <th scope="col">Bill Date</th>
                                                    <th scope="col">Status</th>
                                                    <th scope="col"></th>   
                                                </tr>
                                                </thead>
                                                    <tbody>
                                                        {subOrder && subOrder.map((s,id) =>(
                                                            <>
                                                                <tr>
                                                                    <td >{s.sorder_id}</td>
                                                                    <td >{s.sorder_billdt}</td>
                                                                    <td >{s.sorder_status === "Invoiced" ? (<span className='bold-text green'>{s.sorder_status}</span>):(<span className='bold-text'>{s.sorder_status}</span>)}</td>
                                                                    <td>{s.sorder_status === "Invoiced"? (<><Button variant="light "  className='mx-2' onClick={()=>paynow(s.sorder_id)}>pay Now</Button></>):(<></>)}</td>
                                                                </tr>
                                                            </>
                                                        ))
                                                        }
                                                                        
                                                    </tbody>
                                                </table>

                                    </div>}

                            </>

                         
                                )
                                    : 
                                    (
                                        
                                       
                                        <>

                                        <div className='vertical-text '>
                                            <p>PACKAGE</p>
                                        </div>
                                        <div className='sec-pkg-section mt-5'>
                                            <div className=' '>
                                                <h2>{pkgData.packages_type === "STD" ? "STANDRAD ":"CUSTOMIZED "}<span className='warning'>PACKAGE</span></h2>
                                                <p className='font-12'><span >Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. </span></p>
                                            </div>
                                            <p className='heading bold-text py-3'>Package Details</p>
                                            <p>Package Cost : <span className='bold-text'>{pkgData.packages_cost}</span></p>
                                            <p>Selected Months : <span className='bold-text'>{pkgData.months}</span></p>
                                            <p>Order Status : <span className='bold-text green'>{pkgData.packages_status}</span></p>

                                            <p className='heading bold-text py-3'> Specifications</p>
                                            {
                                                pkgList.PACKAGE_details && pkgList.PACKAGE_details.map((p,id)  =>
                                                <div className=''>
                                                    <p>{p.pspec_text}</p>
                                                    <p>{p.pspec_ans}</p>

                                                </div>
                                            )}
                                            
                                            <p className='heading bold-text py-3'>Questionnaire</p>
                                            {pkgList.Question && pkgList.Question.map((d,id) =>
                                            
                                            
                                            <>
                                            
                                            <Row >
                                                <Col xxl={6} xl={6} md={6} sm={6} > 
                                                    <p>{d.pspec_text}</p>
                                                </Col>

                                                <Col xxl={6} xl={6} md={6} sm={6}> 
                                                    <p className='text-end'>{d.pspec_ans}</p> 
                                                </Col>
                                                <hr></hr>
                                            </Row>
                                            </>

                                            )}
                                               

                                        </div>

                                        


                                    <div className='space-between'>
                                   
                                         {paybtn || pkgData.packages_status === "Accepted"  ? (<> 

                                                   {/* {!frame &&(
                                                    <Button variant="light " onClick={()=>paynow(pkgData.packages_cost)}>pay Now</Button> ) 
                                                    } */}

                                                   {frame &&
                                                       
                                                       <form name="tokenform" id="tokenform" >

                                                          
                                                              
                                                       Acc. Name : &nbsp; <input type="text" name='name' /> <br></br><br></br>
                                                        Card No : &nbsp; &nbsp;&nbsp;&nbsp; <input type="text" name='cardno' /><br></br><br></br>
                                               

                                               
                                                       Expiry Date  :&nbsp; <input type="text" name='ex-date' /><br></br><br></br>

                                                       CVV  : &nbsp;<input type="text" name='cvv'/>  <br></br><br></br>
                                                       Amount &nbsp; : <input type="text" name='amt' value={pkgData.packages_cost}  />
                                                        
                                                   

                                                     <div className='center-align mt-5'>
                                                         <Button variant="light" className='width-100 text-center' onClick={() => paySubmit()} >Submit</Button>
                                                    </div>
                                                    
                                                    
                                                
                                                </form> 
                                                     }


                                                   
                                                <table className="table table-striped table-light mx-5 my-5 ">
                                                        <thead class="thead-dark">
                                                            <tr>
                                                                <th scope="col">Bill Id</th>
                                                                <th scope="col">Bill Date</th>
                                                                <th scope="col">Status</th>
                                                                <th scope="col"></th>   
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                        {
                                                            subOrder && subOrder.map((s,id) =>(
                                                            <>
                                                                <tr>
                                                                    <td >{s.sorder_id}</td>
                                                                    <td >{s.sorder_billdt}</td>
                                                                    <td >{s.sorder_status === "Invoiced" ? (<span className='bold-text green'>{s.sorder_status}</span>):(<span className='bold-text'>{s.sorder_status}</span>)}</td>
                                                                    <td>{s.sorder_status === "Invoiced"? (<><Button variant="light "  className='mx-2' onClick={()=>paynow(s.sorder_id)}>pay Now</Button></>):(<></>)}</td>
                                                                </tr>
                                                            </>
                                                            ))
                                                        }
                                                                        
                                                                        
                                                    </tbody>
                                                </table>
                                                     

                                                </>):
                                       (
                                        pkgData.packages_status === "Success" ? '' :(
                                           <>
                                        {!pkgReject && <Button variant="light" onClick={()=>accept(pkgData.packages_cost,type,pkgData.months)}>Accept</Button>}
                                        <Button variant="light" onClick={()=>reason()}>Reject</Button>

                                        </>)
                                       )}

                                       {pkgReject && <>Select Reason : <select id="reason" onChange={()=>reject(pkgData.packages_cost,type)}>
                                       <option>Select Reason</option>
                                                        <option value="Not Intrested">Not Intrested</option>
                                                        <option value="Need to Add/Remove features">Need to Add/Remove features</option>
                                                        <option value="Change of mind">Change of mind</option>
                                                        <option value="Decided for alternative product">Decided for alternative product</option>
                                                        </select></>
                                       }
                                    </div>

                                    </>
                                    )
                              
                            }


                    <ToastContainer/>
                </Container>
    </>
  )

//   function sent()
//     {
//         setmodelmsg(!modelmsg);
//     }

 function reason()
{
    setPkgReject(true);
}

    function accept(cost,value,month)
    {
        
        

        console.log("va",value)
        const token = sessionstorage.getItem("token");

        const headers ={
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            
        }

        console.log("cost",cost === undefined?0:cost)
        var data = new FormData();

        if(value === "event")
        {
            data.append("event_id",id);
            data.append("customer_id",c_id);
            data.append("cost",cost );
            data.append("status","S");
            data.append("reason","accepted");

            axios({
                method: 'post',
                url: Url+'eventorder',
                data: data,
                headers: headers
                })
                .then(function (response) {
                    //handle success
                    console.log("response",response); 
                    setPayBtn(true);
                    
                    
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                    // toast.success('Order Created !!',{autoClose:3000});
                    // setTimeout(() => history.push('/orders'),3000);
                    setPayBtn(true);
                });
    
        }

        if(value==="package")
        {
            data.append("package_id",id);
            data.append("customer_id",c_id);
            data.append("cost",cost === undefined?0:cost);
            data.append("months",month)
            data.append("status","S");
            data.append("reason","accepted");

            axios({
                method: 'post',
                url: Url+'packageorder',
                data: data,
                headers: headers
                })
                .then(function (response) {
                    //handle success
                    console.log("response",response); 
                    setPayBtn(true);
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                    setPayBtn(true);
                });
            
        }
       
        
        

    }

    function reject(cost,value)
    {

        // var r = reason();
        var r = document.getElementById("reason");
        var reason = r.options[r.selectedIndex].value;
        console.log(reason);

        console.log("reason2",reason);

        const token = sessionstorage.getItem("token");

        const headers ={
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods': 'POST'
        }

        console.log("cost",cost === undefined?0:cost)
        var data = new FormData();

        if(value==="event")
        {
            data.append("event_id",id);
            data.append("customer_id",c_id);
            data.append("cost",cost === undefined?0:cost);
            data.append("status","R");
            data.append("reason",reason);

            axios({
                method: 'post',
                url: Url+'eventorder',
                data: data,
                headers: headers
                })
                .then(function (response) {
                    //handle success
                    console.log("response",response); 
                    toast.success('order Rejected !!',{autoClose:3000})
                    setTimeout(() => history.push('/home'),3000);
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                    toast.success('order Rejected !!',{autoClose:3000})
                    setTimeout(() => history.push('/home'),3000);
                });

        }

        if(value==="package")
        {
            data.append("package_id",id);
            data.append("customer_id",c_id);
            data.append("cost",cost === undefined?0:cost);
            data.append("status","R");
            data.append("reason",reason);


            axios({
                method: 'post',
                url: Url+'packageorder',
                data: data,
                headers: headers
                })
                .then(function (response) {
                    //handle success
                    console.log("response",response); 
                    toast.success('order Rejected !!',{autoClose:3000})
                    setTimeout(() => history.push('/home'),3000);
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                    toast.success('order Rejected !!',{autoClose:3000})
                    setTimeout(() => history.push('/home'),3000);
                });
        }
       
        
        

        
    }

    function paynow(subId)
    {
         setSubId(subId);
        // console.log("clicked")
        setFrame(true);
     
    }


     function paySubmit()
    {
     
        // var data = {
        //     "createTransactionRequest": {
        //         "merchantAuthentication": {
        //             "name": "3Hv96gAPe7Mj",
        //             "transactionKey": "2wX8n46uT37EvB7h"
        //         },
        //         "refId": "123456",
        //         "transactionRequest": {
        //             "transactionType": "authOnlyTransaction",
        //             "amount": "5",
        //             "payment": {
        //                 "creditCard": {
        //                     "cardNumber": "5424000000000015",
        //                     "expirationDate": "2025-12",
        //                     "cardCode": "999"
        //                 }
        //             },
        //             "lineItems": {
        //                 "lineItem": {
        //                     "itemId": "1",
        //                     "name": "vase",
        //                     "description": "Cannes logo",
        //                     "quantity": "18",
        //                     "unitPrice": "45.00"
        //                 }
        //             },
        //             "tax": {
        //                 "amount": "4.26",
        //                 "name": "level2 tax name",
        //                 "description": "level2 tax"
        //             },
        //             "duty": {
        //                 "amount": "8.55",
        //                 "name": "duty name",
        //                 "description": "duty description"
        //             },
        //             "shipping": {
        //                 "amount": "4.26",
        //                 "name": "level2 tax name",
        //                 "description": "level2 tax"
        //             },
        //             "poNumber": "456654",
        //             "customer": {
        //                 "id": "99999456654"
        //             },
        //             "billTo": {
        //                 "firstName": "Ellen",
        //                 "lastName": "Johnson",
        //                 "company": "Souveniropolis",
        //                 "address": "14 Main Street",
        //                 "city": "Pecan Springs",
        //                 "state": "TX",
        //                 "zip": "44628",
        //                 "country": "US"
        //             },
        //             "shipTo": {
        //                 "firstName": "China",
        //                 "lastName": "Bayles",
        //                 "company": "Thyme for Tea",
        //                 "address": "12 Main Street",
        //                 "city": "Pecan Springs",
        //                 "state": "TX",
        //                 "zip": "44628",
        //                 "country": "US"
        //             },
        //             "customerIP": "192.168.1.1",
        //             "userFields": {
        //                 "userField": [
        //                     {
        //                         "name": "MerchantDefinedFieldName1",
        //                         "value": "MerchantDefinedFieldValue1"
        //                     },
        //                     {
        //                         "name": "favorite_color",
        //                         "value": "blue"
        //                     }
        //                 ]
        //             },
        //         "processingOptions": {
        //              "isSubsequentAuth": "true"
        //             },
        //          "subsequentAuthInformation": {
        //              "originalNetworkTransId": "123456789NNNH",
        //              "originalAuthAmount": "45.00",
        //              "reason": "resubmission"
        //             },			
        //             "authorizationIndicatorType": {
        //             "authorizationIndicator": "pre"
        //           }
        //         }
        //     }
        // }
        //   console.log(data);

        //   const headers = {
        //       'Content-Type':'application/json'
        //   }
        
           
        //   await axios({
        //     method: 'post',
        //     url: 'https://apitest.authorize.net/xml/v1/request.api',
        //     data: data,
        //     headers: headers
        //     })
        //     .then(function (response) {
        //         //handle success
        //         console.log("response",response.data); 
        //         toast.success('Order Created !!',{autoClose:3000});
        //         setTimeout(() => history.push('/home'),3000);
        //     })
        //     .catch(function (response) {
        //         //handle error
        //         console.log(response);
        //         toast.success('Order Created !!',{autoClose:3000});
        //         setTimeout(() => history.push('/home'),3000);
        //     });
         
        const token = sessionstorage.getItem("token");

        const headers ={
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
            
        }

        var data = new FormData();
        console.log(subId)
        data.append("suborder_id",subId);
        data.append("order_id",Order.order_id);
        data.append("amount",Order.order_amt);
            
           

            axios({
                method: 'post',
                url: Url+'paybefore',
                data: data,
                headers: headers
                })
                .then(function (response) {
                    //handle success
                    console.log("pay Before",response); 

                        var data1 = new FormData();
                        data1.append("transaction_id",response.data.id);
                        data1.append("order_id",response.data.txn_order);
                        data1.append("status","Success");
                        data1.append("suborder_id",response.data.txn_suborder);

                        axios({
                            method: 'post',
                            url: Url+'payafter',
                            data: data1,
                            headers: headers
                            })
                            .then(function (response) {
                                //handle success
                                console.log("pay After",response); 
            
                                toast.success('Payment Success!!',{autoClose:3000});
                                setTimeout(() => history.push('/orders'),3000);
                            })
                            .catch(function (response) {
                                //handle error
                                console.log(response);
                            
                            });

                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                   
                });
    

       
    }
}
