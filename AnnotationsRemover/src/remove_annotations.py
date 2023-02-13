# -*- coding: utf-8 -*-

from typing import Optional

import libcst as cst
from libcst.metadata import WhitespaceInclusivePositionProvider


class Printer(cst.CSTVisitor):
    METADATA_DEPENDENCIES = (
        cst.metadata.PositionProvider,
        WhitespaceInclusivePositionProvider,
    )
    pos_annotations: list[(int, int, int, int)] = []

    def __init__(self, pos_annotations: list[(int, int, int, int)]) -> None:
        self.pos_annotations = pos_annotations

    def visit_Annotation(self, node: "Annotation") -> Optional[bool]:
        pos_start = self.get_metadata(
            cst.metadata.WhitespaceInclusivePositionProvider, node
        ).start
        pos_end = self.get_metadata(
            cst.metadata.WhitespaceInclusivePositionProvider, node
        ).end
        self.pos_annotations.append(
            (pos_start.line, pos_start.column, pos_end.line, pos_end.column)
        )


def remove_annotations(source: str, safe: bool = True) -> str:
    try:
        tree = cst.parse_module(source)
    except:
        return "..."

    wrapper = cst.metadata.MetadataWrapper(tree)
    pos_annotations: list[(int, int, int, int)] = []
    result = wrapper.visit(Printer(pos_annotations))

    def print_no_annotation(
        pos_annotations: list[(int, int, int, int)], line_no: int, line: int
    ) -> str:
        skip = False
        print_line = line + "\n"
        for item in reversed(pos_annotations):
            pos_start_line, pos_start_column, pos_end_line, pos_end_column = item
            if pos_start_line < line_no < pos_end_line:
                skip = True
                break
            elif pos_start_line == line_no == pos_end_line:
                print_line = (
                    print_line[0:pos_start_column] + print_line[pos_end_column:]
                )
                continue
            elif pos_start_line == line_no:
                print_line = print_line[0:pos_start_column]
                continue
            elif pos_end_line == line_no:
                print_line = print_line[pos_end_column:]
                continue
        if skip:
            return
        return print_line

    line_no = 1
    ret = []

    for line in tree.code.splitlines():
        no_annotation_code = print_no_annotation(pos_annotations, line_no, line)
        if "annotations" in no_annotation_code or "typing" in no_annotation_code:
            pass
        else:
            ret.append(no_annotation_code)
        line_no += 1
    return "".join(ret).strip()
