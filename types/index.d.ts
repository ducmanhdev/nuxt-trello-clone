import type {InitialValue as HandleEditBoardArgs} from "~/components/Slide/Board.vue";

export type SlideController = {
    handleEditBoard: (initialValue: HandleEditBoardArgs) => void;
    handleEditList: (initialValue: HandleEditBoardArgs) => void;
}