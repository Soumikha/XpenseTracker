import './App.css';
import UploadReceipt from './UploadReceipt';
import ManualEnter from './ManualEnter';
import AudioEnter from './AudioEnter'; 
import XReport from './XReport';

import { useState } from 'react';
function App() {
    
    const [viewName, setViewName] = useState('mainMenu'); 

function UploadReceiptAlert() {
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
function ExpenseReportsAlert() {
    setViewName('ExpenseReports');
}
function closeView() {
    setViewName('mainMenu');
}

    return (<div> 
        <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">&nbsp;XPENSE TRACKER</a> <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon"></span> </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item"> 
                            <a className={`nav-link ${viewName === 'mainMenu' ? 'active' : ''}`} 
                               aria-current="page" 
                               href="#" 
                               onClick={() => closeView()}>
                               ENTER EXPENSE
                            </a> 
                        </li>
                        <li className="nav-item"> 
                            <a className={`nav-link ${viewName === 'ExpenseReports' ? 'active' : ''}`} 
                               href="#" 
                               onClick={() => ExpenseReportsAlert()}>
                               EXPENSE REPORTS
                            </a> 
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
            <h1 className="display-4 fw-normal page-title" >
                {viewName === 'ExpenseReports' ? 'EXPENSE REPORTS' : 'ENTER EXPENSE'}
            </h1>
            
            {viewName === 'mainMenu' && <p className="fs-5  text-uppercase page-description">Enter your Expense through any of these options.</p>}
        </div>
        {viewName === 'mainMenu' &&
            (
                <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                    <div className="col">
                        <div className="mb-4 rounded-3 shadow-sm">
                            <div className="card-body">
                            <div className="d-flex align-items-center mt-3 mb-4">
                                <img src="./uploaddd.png" width="100" className="me-3"/>
                                <div>
                                    <h3 className="my-0 fw-normal text-start card-title">RECIEPT</h3>
                                    <p className="mb-0 mt-2 text-start card-desc">Upload photo of your receipt/credit statement.</p>
                                </div>
                            </div>
                                <button type="button" className="w-100 btn btn-lg btn-outline-primary card-btn" onClick={() => UploadReceiptAlert()} >
                                    UPLOAD
                                </button>
                            </div>
                        </div>
                </div>

                <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                    <div className="col">
                        <div className="mb-4 rounded-3 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center mt-3 mb-4">
                                    <img src="./audioo.png" width="100" className="me-3" />
                                    <div>
                                        <h3 className="my-0 fw-normal text-start card-title">Audio</h3>
                                        <p className="mb-0 mt-2 text-start card-desc">Use Audio to Record your Expenses.</p>
                                    </div>
                                </div>
                                <button type="button" className="w-100 btn btn-lg btn btn-primary border border-3 border-dark card-btn " onClick={() => AudioExpensesAlert()} >
                                    RECORD AND UPLOAD
                                </button>
                            </div>
                        </div>
                        </div>
                </div>

                <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                    <div className="col">
                        <div className="mb-4 rounded-3 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center mt-3 mb-4">
                                    <img src="./manuall.png" width="100" className="me-3" />
                                    <div>
                                        <h3 className="my-0 fw-normal text-start card-title">Manual</h3>
                                        <p className="mb-0 mt-2 text-start card-desc">Type in your Expenses.</p>
                                    </div>
                                </div>
                                <button type="button" className="w-100 btn btn-lg btn-outline-primary card-btn" onClick={() => ManualAlert()} >
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
        {viewName === 'ExpenseReports' && (<div> <XReport /> </div>)}
        {viewName === 'UploadCreditStatement' && <h1>Upload Credit Statement</h1>}

        {viewName != 'mainMenu' && (<><br /><br /> <input type='button' className="btn btn-secondary" id='backButton' value="BACK" onClick={() => closeView()} /> </>)}
    </div>
        
    );

}

export default App;