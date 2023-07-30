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
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}
  

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
    emails.forEach(email => {
      let ePlace = document.createElement('div');
      ePlace.className = email['read'] ? "email-list-item-read" : "email-list-item-unread";
      ePlace.innerHTML = `<span class="sender col-3"> <b>${email['sender']}</b> </span>
                          <span class="subject col-6"> ${email['subject']} </span>
                          <span class="timestamp col-3"> ${email['timestamp']} </span>`;

      ePlace.addEventListener('click', () => load_mailPage(email['id']));
      document.querySelector('#emails-view').appendChild(ePlace);
    });
  });
}

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
}



function load_mailPage(id){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-page').style.display = 'block';

  console.log(id)

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    const emailView = document.querySelector('#email-page');

    console.log(email)

    emailView.innerHTML = `<h3>${email['subject']}</h3>
                           <h4>From: ${email['sender']}</h4>
                           <h4>To: ${email['recipients']}</h4>
                           <p>${email['body']}</p>
                           <span><b>${email['timestamp']}</b></span>`;
    readArchive(email['id']);

  })
  .catch(error => {
    console.log('Error:', error);
  });
}

function readArchive(id)
{
  
}