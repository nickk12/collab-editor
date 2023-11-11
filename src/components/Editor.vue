<template>
    <div class="editor" v-if="editor">
    <menu-bar class="editor__header" :editor="editor" />
    <editor-content class="editor__content" :editor="editor" />
    <div class="editor__footer">
      <bubble-menu
      class="bubble-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        Bold
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        Italic
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        Strike
      </button>
    </bubble-menu>
    <floating-menu
      class="floating-menu"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }" class="bullet">
        H1
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }" class="bullet">
        H2
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="bullet">
        Bullet List
      </button>
    </floating-menu>

      <div class="editor__name">
        <button @click="setName">
          {{ currentUser.name }}
        </button>
      </div>
    </div>
  </div>
  
  </template>
  
  <script>
  import StarterKit from '@tiptap/starter-kit'; 
  import { BubbleMenu, FloatingMenu, Editor, EditorContent } from '@tiptap/vue-3'; 
  import Collaboration from '@tiptap/extension-collaboration'; 
  import { HocuspocusProvider } from '@hocuspocus/provider'; 
  import CollaborationCursor from '@tiptap/extension-collaboration-cursor'; 
  import { variables } from '../../variables.js'; 
  import MenuBar from './MenuBar.vue'; 
  import * as Y from 'yjs'
  /*import Mention from '@tiptap/extension-mention'; 
  import suggestion from '../../suggestion.js'; 
*/
  const ydoc = new Y.Doc()
  
  const provider = new HocuspocusProvider({ 
    url: 'ws://localhost:5137', //Localhost url with port number 
    name: "collab-editor", 
  }); 

  const getRandomElement = list => {
  return list[Math.floor(Math.random() * list.length)]
  }

  const getRandomRoom = () => {
    const roomNumbers = variables.collabRooms?.trim()?.split(',') ?? [10, 11, 12]
    return getRandomElement(roomNumbers.map(number => `rooms.${number}`))
  }

  export default {
    components: {
      EditorContent,
      MenuBar,
      BubbleMenu,
      FloatingMenu
    },

   
  
    data() {
      return {
        currentUser: JSON.parse(localStorage.getItem('currentUser')) || {
          name: this.getRandomName(),
          color: this.getRandomColor(),
      },
      provider: null,
      editor: null,
      status: 'connecting',
      room: getRandomRoom(),
    }
  },
  
    mounted() {
      this.editor = new Editor({
        extensions: [
          StarterKit.configure({
            // The Collaboration extension comes with its own history handling
            history: false,
            
          }),

          Collaboration.configure({
            document: provider.document
          }),
          CollaborationCursor.configure({
            provider: provider, 
            
          }), 
          /*
          Mention.configure({
            HTMLAttributes: {
              class: 'mention',
            }, 
            suggestion,
          })*/ 
        ],
        content: `
          <h2>
            Hi there,
          </h2>
          <p>
            you can display your message <em>here</em>. <br/>
            real-time collaboration editor
          </p>
        `,
      })
    },

    methods: {
    setName() {
      const name = (window.prompt('Name') || '')
        .trim()
        .substring(0, 32)

      if (name) {
        return this.updateCurrentUser({
          name,
        })
      }
    },

    updateCurrentUser(attributes) {
      this.currentUser = { ...this.currentUser, ...attributes }
      this.editor.chain().focus().updateUser(this.currentUser).run()

      localStorage.setItem('currentUser', JSON.stringify(this.currentUser))
    },

    getRandomName() {
      return getRandomElement([
        'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder', 'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry', 'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose', 'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey', 'Mickey Rourke', 'John Cusack', 'Matthew Broderick', 'Justine Bateman', 'Lisa Bonet',
      ])
    },
  
    beforeUnmount() {
      this.editor.destroy()
    },
    getRandomColor() {
      return getRandomElement([
        '#958DF1',
        '#F98181',
        '#FBBC88',
        '#FAF594',
        '#70CFF8',
        '#94FADB',
        '#B9F18D',
      ])
    },
   
  },

  beforeUnmount() {
    this.editor.destroy()
  },

}
  </script>
  
  <style lang="scss">
  /* Basic editor styles */

  floating-menu {
  display: flex;
  background-color: #0D0D0D;
  padding: 0.2rem;
  border-radius: 0.5rem;

  button {
    border: none;
    background: none;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;
    

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}
  .bubble-menu {
  display: flex;
  background-color: #0D0D0D;
  padding: 0.2rem;
  border-radius: 0.5rem;

  button {
    border: none;
    background: #0D0D0D;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 500;
    padding: 0 0.2rem;
    opacity: 0.6;

    &:hover,
    &.is-active {
      opacity: 1;
    }
  }
}
  .tiptap {
    > * + * {
      margin-top: 0.75em;
    }
  
    ul,
    ol {
      padding: 0 1rem;
    }

    .mention {
    border: 1px solid #000;
    border-radius: 0.4rem;
    padding: 0.1rem 0.3rem;
    box-decoration-break: clone;
    }
  
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }
  
    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }
  
    pre {
      background: #0D0D0D;
      color: #FFF;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
  
      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }
  
    img {
      max-width: 100%;
      height: auto;
    }
  
    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0D0D0D, 0.1);
    }
  
    hr {
      border: none;
      border-top: 2px solid rgba(#0D0D0D, 0.1);
      margin: 2rem 0;
    }
  }
  </style>