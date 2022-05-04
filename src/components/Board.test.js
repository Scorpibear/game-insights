import { render } from '@testing-library/vue'

// mocks to make Chessboard work
window.$ = () => {}
window.Chessboard = () => ({orientation: () => {}, position: () => {}})

import Board from './Board.vue'

it('displays eco', () => {
  const { getByText } = render(Board, {
    props: {
      game: {pgn: '', moves: '', opening: {eco: "D99", name: "New One"}},
      username: 'testuser'
    }
  })

  // assert output
  getByText('D99: New One');
})