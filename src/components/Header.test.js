import { render } from '@testing-library/vue'

import Header from './Header.vue'

test('requests lichess username', () => {
  const { getByText } = render(Header, {
    props: {
    }
  })

  // assert output
  getByText('Game Insights for lichess username:')
})