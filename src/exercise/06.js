// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import {
  PokemonForm,
  PokemonInfoFallback,
  PokemonDataView,
  fetchPokemon,
} from '../pokemon'

class ErrorBoundary extends React.Component {
  state = {
    error: null,
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return {error}
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return (
        <div>
          There was an error:{' '}
          <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

const statuses = {
  idle: 'idle',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
}

// In the future, you'll learn about how `useReducer` can solve this problem really
// elegantly, but we can still accomplish this by storing our state as an object
// that has all the properties of state we're managing.

// oops :)

function reducer(state, action) {
  switch (action.type) {
    case statuses.pending:
      return {
        ...state,
        status: statuses.pending,
        pokemon: null,
        error: null,
      }
    case statuses.resolved:
      return {
        ...state,
        status: statuses.resolved,
        pokemon: action.pokemon,
        error: null,
      }
    case statuses.rejected:
      return {
        ...state,
        status: statuses.rejected,
        pokemon: null,
        error: action.error,
      }
    default:
      throw new Error('Oh no 😱')
  }
}

function PokemonInfo({pokemonName}) {
  // 🐨 Have state for the pokemon (null)
  const [state, dispatch] = React.useReducer(reducer, {
    status: statuses.idle,
    error: null,
    pokemon: null,
  })
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  React.useEffect(() => {
    // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
    if (!pokemonName) return
    // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
    dispatch({
      type: statuses.pending,
      pokemon: null,
    })
    // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
    //   fetchPokemon('Pikachu').then(
    //     pokemonData => { /* update all the state here */},
    //   )
    async function getPokemon() {
      try {
        const pokemon = await fetchPokemon(pokemonName)

        dispatch({
          type: 'resolved',
          pokemon,
        })
      } catch (error) {
        dispatch({
          type: 'rejected',
          error,
        })
      }
    }

    getPokemon()
  }, [pokemonName])

  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  switch (state.status) {
    case statuses.rejected:
      throw state.error
    case statuses.idle:
      return 'Submit a pokemon'
    case statuses.pending:
      return <PokemonInfoFallback name={pokemonName} />
    case statuses.resolved:
      return <PokemonDataView pokemon={state.pokemon} />
    default:
      throw new Error('Shoot...')
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
