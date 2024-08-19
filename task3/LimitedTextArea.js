document.addEventListener('DOMContentLoaded', function(){
   //class for limited-textarea that extends class of HTMLElement
    class LimitedTextArea extends HTMLElement{
        constructor(){
            super();
            //class attributes
            this.maxchars = this.getAttribute('maxchars');
            this.color = '#000';
            this.currentchars = this.maxchars;
            //create a shadow root
            const shadowRoot = this.attachShadow({mode: 'open'});

            //style
            const style = document.createElement('style');
            style.innerHTML = `
                .section-limited-textarea{
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;                
                }
                .form-control{
                    transition: all 0.4s ease;
                    border: none;
                    box-shadow: 2px 2px 5px 2px rgba(0,0,0,.4);
                    border-radius : 0.25rem;
                    resize: none
                }
                
                .output{
                    font-weight: bold;
                    color: #666;
                    
                }
                
                .output > .character-left{
                    color: ${this.color};
                }
            `;

            // html element
            const textarea = document.createElement('textarea');
            textarea.classList.add('form-control');
            textarea.rows = '6';

            const output = document.createElement('output');
            output.classList.add('output');
            output.innerHTML = `
            <span class='character-left'>${ this.currentchars}</span> characters left
            `;

            const section = document.createElement('section');
            section.classList.add('section-limited-textarea');

            //append to the a singular section
            section.appendChild(textarea);
            section.appendChild(output);
            //append to the shadow root
            shadowRoot.appendChild(style);
            shadowRoot.appendChild(section);
        }
        //mounted
        connectedCallback(){
            //add the input event to the textarea and dispatch change event to the parent
            this.shadowRoot.querySelector('.form-control').addEventListener('input' , (e)=>{
                this.update(e.target.value.length);
                this.dispatchEvent(new CustomEvent('change' , {
                   detail:{//need to pass data inside detail or else it wont get recognized by the Custom Event constructor
                       value: this.currentchars  >= 0  ? this.currentchars : this.maxchars,
                       valid: this.currentchars >= 0,
                   }
                }));
            })

        }
        //unmounted
        disconnectedCallback(){

        }
        //set up observer/watcher for mutations on attributes
        static get observedAttributes(){
            return [''];
        }
        //update the value of characters left
        update(l){
            this.currentchars = this.maxchars - l;
            //check whether the characters left if below 10% and not exceed below the limit
            if(this.currentchars / this.maxchars * 100  < 10 && this.currentchars / this.maxchars * 100 >= 0){
                //change the color
                this.color = '#f0620d';
            }

            //if exceed below the limit
            if(this.currentchars / this.maxchars * 100 < 0){
                //change the color
                this.color = '#ea1010';
            }
            //update the dom and color
            let charLeft =  this.shadowRoot.querySelector('.character-left');
            charLeft.innerHTML = this.currentchars;
            charLeft.style.color = this.color;
        }
    }

    //define the custom element
    if('customElements' in window){
        customElements.define('limited-textarea' , LimitedTextArea);
    }

});