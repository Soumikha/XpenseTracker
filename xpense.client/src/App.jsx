import './App.css';
import UploadReceipt from './UploadReceipt';
import ManualEnter from './ManualEnter';
import AudioEnter from './AudioEnter'; 


import { useState } from 'react';
function App() {
    
    const [viewName, setViewName] = useState('mainMenu'); 

function UploadReceiptAlert() {
    //alert("show file upload option");
    setViewName('UploadReceipt');
}
function AudioExpensesAlert() {
    setViewName('AudioExpense');


}
function ManualAlert() {
    setViewName('ManualEnter');
}
function UploadCreditStatementAlert() {
    setViewName('UploadCreditStatement');
    }
   function closeView() {
        setViewName('mainMenu');
    }


    return (<div> 
        <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">&nbsp;XPENSE TRACKER</a> <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button>
                <div class="collapse navbar-collapse" id="navbarCollapse">
                    <ul class="navbar-nav me-auto mb-2 mb-md-0">
                        <li class="nav-item"> <a class="nav-link active" aria-current="page" href="#">ENTER EXPENSE</a> </li>
                        <li class="nav-item "> <a class="nav-link " href="#">EXPENSE REPORTS</a> </li>
                       
                    </ul>
                 
                </div>
            </div>
        </nav>
        <div class="pricing-header p-3 pb-md-4 mx-auto text-center">
            <h1 class="display-4 fw-normal page-title" >ENTER EXPENSE</h1>
            
            {viewName === 'mainMenu' && <p class="fs-5  text-uppercase page-description">Enter your Expense through any of these options.</p>}
        </div>
        {viewName === 'mainMenu' &&
            (
                <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
                    <div class="col">
                        <div class="mb-4 rounded-3 shadow-sm">
                            {/*<div class="card-header py-3">*/}
                               
                            {/*</div>*/}
                            <div class="card-body">

                            <div class="d-flex align-items-center mt-3 mb-4">
                                <img src="./uploaddd.png" width="100" class="me-3"/>
                                <div>
                                    <h3 class="my-0 fw-normal text-start card-title">RECIEPT</h3>
                                    <p class="mb-0 mt-2 text-start card-desc">Upload photo of your receipt/credit statement.</p>
                                </div>
                            </div>
                                <button type="button" class="w-100 btn btn-lg btn-outline-primary card-btn" onClick={() => UploadReceiptAlert()} >
                                    UPLOAD
                                </button>
                            </div>
                        </div>
                </div>


                <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
                    <div class="col">
                        <div class="mb-4 rounded-3 shadow-sm">
                            {/*<div class="card-header py-3">*/}

                            {/*</div>*/}
                            <div class="card-body">

                                <div class="d-flex align-items-center mt-3 mb-4">
                                    <img src="./audioo.png" width="100" class="me-3" />
                                    <div>
                                        <h3 class="my-0 fw-normal text-start card-title">Audio</h3>
                                        <p class="mb-0 mt-2 text-start card-desc">Use Audio to Record your Expenses.</p>
                                    </div>
                                </div>
                                <button type="button" class="w-100 btn btn-lg btn btn-primary border border-3 border-dark card-btn " onClick={() => AudioExpensesAlert()} >
                                    RECORD AND UPLOAD
                                </button>
                            </div>
                        </div>
                        </div>
                </div>


                <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
                    <div class="col">
                        <div class="mb-4 rounded-3 shadow-sm">
                            {/*<div class="card-header py-3">*/}

                            {/*</div>*/}
                            <div class="card-body">

                                <div class="d-flex align-items-center mt-3 mb-4">
                                    <img src="./manuall.png" width="100" class="me-3" />
                                    <div>
                                        <h3 class="my-0 fw-normal text-start card-title">Manual</h3>
                                        <p class="mb-0 mt-2 text-start card-desc">Type in your Expenses.</p>
                                    </div>
                                </div>
                                <button type="button" class="w-100 btn btn-lg btn-outline-primary card-btn" onClick={() => ManualAlert()} >
                                    ENTER
                                </button>
                            </div>
                        </div>
                        </div>
                       
                    </div>
                </div>
            )
        }
        
        {viewName === 'UploadReceipt' && (<div> <h1>Upload Receipt</h1> <UploadReceipt />   <br /><br />
 </div>)} 
        {viewName === 'AudioExpense' && (<div> <h1>Audio Expense</h1> <AudioEnter/> <br /><br /> </div>)}
        {viewName === 'ManualEnter' && (<div> <h1>Manual</h1> <ManualEnter /> 
        </div>)}
        {viewName === 'UploadCreditStatement' && <h1>Upload Credit Statement</h1>}

        {viewName != 'mainMenu' && (<><br /><br /> <input type='button' class="btn btn-secondary" id='backButton' value="BACK" onClick={() => closeView()} /> </>)}
    </div>
  
        
    );


}


export default App;