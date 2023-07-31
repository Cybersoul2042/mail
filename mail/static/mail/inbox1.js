document.addEventListener('DOMContentLoaded', function() {
  
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', submit);

  // By default, load the inbox
  load_mailbox('inbox');
  
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-page').style.display = 'none';
  // Clear out composition fields
  
  document.querySelector('#compose-head').innerHTML = 'New Email';
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.querySelector('#compose-recipients').disabled = false;
  document.querySelector('#compose-subject').disabled = false;
  document.querySelector('#compose-body').placeholder = 'Body';

}

// Fill out composition fields when replied
function compose_reply(sub,  sender, body, time){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-page').style.display = 'none';
  
  document.querySelector('#compose-recipients').value = `${sender}`;
  document.querySelector('#compose-subject').value = `Re: ${sub}`;
  document.querySelector('#compose-body').placeholder = `On ${time} ${sender} said: ${body}`;

  document.querySelector('#compose-recipients').disabled = true;
  document.querySelector('#compose-subject').disabled = true;
  document.querySelector('#compose-head').innerHTML = 'Reply';
}
  
  
// Loading mail box
function load_mailbox(mailbox) 
{
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-page').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
    if(!emails.length)
    {
      let ePlace = document.createElement('div');
      ePlace.setAttribute('class', 'Email-Null');
      ePlace.innerHTML = 'There Are No Emails Here Right Now!!!'
      document.querySelector('#emails-view').appendChild(ePlace);
    }
    else
    {
      emails.forEach(email => {
        let ePlace = document.createElement('div');
        ePlace.setAttribute('class', 'Email');
        ePlace.innerHTML = `<span class="sender"> <b>${email['sender']}</b></span> |
                            <span class="subject"> ${email['subject']} </span> |
                            <span class="timestamp"> ${email['timestamp']} </span>`;
  
        ePlace.addEventListener('click', () => load_mailPage(email['id'], mailbox));
        document.querySelector('#emails-view').appendChild(ePlace);
      });
    }
  });
}

// Submitting composition form
function submit()
{
  
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value,
    })
  })
  .then(response => response.json())
  .catch(error => {
    console.log('Error:', error)
  });
  console.log(4000)
}


// Loading mail pages
function load_mailPage(id, mailbox){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-page').style.display = 'block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    const emailView = document.querySelector('#email-page');

    emailView.innerHTML = `<header class="email-subject">Subject: ${email['subject']}</header>
                           <div class="email-detail">
                            <p class="email-sender">From: ${email['sender']}</p>
                            <p class="email-recipient">To: ${email['recipients']}</p>
                            <p class="email-time">${email['timestamp']}</p>
                           </div>
                           <div class="email-body"><p>${email['body']}</p></div>`;

    if(mailbox !== 'sent')
    {
      emailView.innerHTML += `<div class="email-btn">
                                <button class="btn btn-sm btn-outline-primary" id="archive" ></button>
                                <button class="btn btn-sm btn-outline-primary" id="reply" >Reply</button>
                              </div>`;

      const reply = document.querySelector('#reply')
      const arcCheck = document.querySelector('#archive');
      arcCheck.innerHTML = !email['archived'] ? 'Archive' : 'Unarchive';

      arcCheck.addEventListener('click', () => make_Archive(email['id'], email));

      reply.addEventListener('click', () => {
        compose_reply(email['subject'], email['sender'], email['body'], email['timestamp'])
      });

      read(email['id']);
      
    }

  })
  .catch(error => {
    console.log('Error:', error);
  });
}

// Checking read state after opening a mail page
function read(id)
{
  console.log(id)
  fetch('/emails/' + id, {
    method: 'PUT',
    body: JSON.stringify({read: true})
  })
  .catch(error => {
    console.log('Error:', error);
  });
}

// Make a inbox mail archive after clicking on a button or reverse
function make_Archive(id, email)
{ 
  fetch('/emails/' + id, {
    method: 'PUT',
    body: JSON.stringify({ archived : !email['archived'] })
  })
  .then(response => load_mailbox('inbox'))
  .catch(error => {
    console.log('Error: ', error)
  });
    
}