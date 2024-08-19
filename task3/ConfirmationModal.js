document.addEventListener('DOMContentLoaded', function(){
    //class for the custom element
    class ConfirmationModal extends HTMLElement{
        constructor(){
            super();//call the constructor of parent => HTMLElement

            //class attributes
            this.label = this.getAttribute('label') || 'Ok';
            this.slot = "<h1>Hello World</h1>";
            this.backdrop = "rgba(0, 0, 0, 0.3)";

            //create shadow root
            const shadowRoot = this.attachShadow({
                mode: 'open'
            });

            //style for the custom component
            const style = document.createElement('style');
            style.innerHTML = `
                dialog::backdrop{
                    background-color: ${this.backdrop};
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100dvh;
                    z-index: -1;
                }
                
                .modal  button{
                    display: block;
                    margin: 10px 10px 10px auto;
                }
                
                .modal{
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    padding: 1rem;
                    margin: 0;
                    z-index: 999;
                    width: 200px;
                }
            `;


            //dom element
            const modal = document.createElement('dialog');
            modal.classList.add('modal');

            const button = document.createElement('button');
            button.textContent = `${this.label}`;

            //pass the slot value to here
            modal.innerHTML = '<div class="modal-content"><slot></slot></div>';
            modal.appendChild(button);

            //append to the shadow root
            shadowRoot.appendChild(style);
            shadowRoot.appendChild(modal);
        }
        //     onmounted
        connectedCallback(){
            //open the modal on creation
            //have to use showModal in order for the backdrop to work
            this.shadowRoot.querySelector('.modal').showModal();
            //add event when the button is clicked and dispatch a custom event name confirm back to the parent component
            this.shadowRoot.querySelector('.modal button').addEventListener("click" , ()=>{
                //close the modal
                this.shadowRoot.querySelector('.modal').close();
                //dispatch custom event
                this.shadowRoot.dispatchEvent(new CustomEvent('confirm'));
            });
        }
    }

    //define the custom component
    if("customElements" in window){
        customElements.define('confirmation-modal', ConfirmationModal);
    }
})