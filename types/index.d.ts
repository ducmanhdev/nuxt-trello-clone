import type { InitialValue as HandleEditBoardArgs } from '~/components/Slide/Board.vue'
import type { InitialValue as HandleEditListArgs } from '~/components/Slide/List.vue'

export type SlideController = {
  handleEditBoard: (initialValue: HandleEditBoardArgs) => void
  handleEditList: (initialValue: HandleEditListArgs) => void
}
