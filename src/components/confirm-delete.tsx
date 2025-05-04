import { Button } from "./ui/button";
import { Dialog, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";

import { DialogContent } from "./ui/dialog";

interface ConfirmDeleteProps {
	isDeleteDialogOpen: boolean;
	setIsDeleteDialogOpen: (isDeleteDialogOpen: boolean) => void;
	confirmDelete: () => void;
}

export const ConfirmDelete = ({ isDeleteDialogOpen, setIsDeleteDialogOpen, confirmDelete }: ConfirmDeleteProps) => {
	return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirmar Exclusão</DialogTitle>
					</DialogHeader>
					<p>Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.</p>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
							Cancelar
						</Button>
						<Button variant="destructive" onClick={confirmDelete}>
							Excluir
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
  )
};
