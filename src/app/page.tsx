'use client';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Page: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showThankYouModal, setShowThankYouModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [backgroundImage, setBackgroundImage] = useState<string>('');

  const handleYesClick = () => {
    setShowForm(true);
    setAnswer('Mau');
    setBackgroundImage("url('https://media1.tenor.com/m/j9nwwKpnx5wAAAAd/cap.gif')");
  };

  const handleNoClick = () => {
    setShowForm(true);
    setAnswer('Tidak');
    setBackgroundImage("url('https://media1.tenor.com/m/2E6SQ6csxQsAAAAC/fire-spongebob.gif')");
  };

  const handleOpenModal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleThankYouModalClose = () => {
    // Setelah modal terima kasih ditutup, reset formulir dan state
    setShowForm(false);
    setAnswer('');
    setReason('');
    setBackgroundImage('');
    setShowThankYouModal(false);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true); 
      const currentDate = new Date().toISOString();
      const data = {
        answer,
        reason,
        createdAt: currentDate, // Tambahkan tanggal saat ini ke data
      };

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      const responseData = await response.json();
      console.log('Data saved successfully:', responseData);
      setIsOpen(false);
      setShowThankYouModal(true);
      try {
        sendMessage()
      } catch (error) {
        console.error('Error send wa:', error);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error("Duh ada error lagih, silahkan hubungin akbar.", {
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false); // Set loading state back to false when finished
    }
  };

  const sendMessage = async (): Promise<void> => {
    const myHeaders: Headers = new Headers();
    myHeaders.append("Authorization", "App d08c937e295d3dcfcce9dcff0d6b53ac-496d0b23-6428-44d2-816e-6fdc96527fc9");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
  
    const raw: string = JSON.stringify({
      "messages": [
        {
          "from": "447860099299",
          "to": "6281386701218",
          "messageId": "99093650-44fc-44b7-829a-ade94fa17525",
          "content": {
            "templateName": "message_test",
            "templateData": {
                "body": {
                    "placeholders": ["akbar"]
                }
            },
            "language": "en"
          }
        }
      ]
    });
  
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
  
    try {
      const response: Response = await fetch("https://8gqrj9.api.infobip.com/whatsapp/1/message/template", requestOptions);
      const result: string = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div 
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh', // 100% tinggi viewport
        width: '100vw', // 100% lebar viewport
      }}
    >
      <ToastContainer />
      <div className="flex justify-center mb-4 pt-8">
        <span>Mau engga kita ldr-an press ?</span>
      </div>
      <div className="flex justify-center">
        <button className="button" onClick={handleYesClick}>Mau....</button>
        <button className="button" onClick={handleNoClick}>Engga dulu...</button>
      </div>
      <div className="flex justify-center m-8">
        <img src="https://media1.tenor.com/m/x0-wEQe6izQAAAAd/attention-seeking-attention-please.gif" alt="Tolong Ampun" height="400" />
      </div>
      <div className="flex justify-center">
        {showForm && (
          <form onSubmit={handleOpenModal} className="form">
            <label htmlFor="reason">Alasan {answer}:</label>
            <textarea
              id="reason"
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              cols={50}
              className="input"
              required
            />
            <input type="submit" value="Kirim" className='submitButton' />
          </form>
        )}
      </div>
      <Modal isOpen={isOpen} isLoading={isLoading} onClose={handleCloseModal} onConfirm={handleConfirm} />
      {showThankYouModal && (
        <ThankYouModal onClose={handleThankYouModalClose} />
      )}
    </div>
  );
};

const Modal: React.FC<{ isOpen: boolean; isLoading: boolean; onClose: () => void; onConfirm: () => void }> = ({ isOpen, isLoading, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Kamu yakin engga?</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Yaudah kalau kamu sudah yakin klik tombol yes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button onClick={onConfirm} type="button" disabled={isLoading} className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {isLoading ? 'Sedang mengirim...' : 'Yes'}
            </button>
            <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThankYouModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Udah kekirim!</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Makasih ya udah dijawab, jawaban kamu sangat berarti bagi aku. nanti aku akan cek
                    kamu bisa berubah pikiran dengan submit formnya lagi ya...
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button onClick={onClose} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
