import { NodeViewWrapper } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import React, { useRef } from "react";

const ResizableImageComponent = (props) => {
  const imgRef = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const onMouseDown = (e) => {
    e.preventDefault();
    startX.current = e.clientX;
    startWidth.current = imgRef.current.offsetWidth;

    const onMouseMove = (event) => {
      const newWidth = startWidth.current + (event.clientX - startX.current);
      props.updateAttributes({ width: newWidth });
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const deleteImage = () => {
    props.deleteNode(); // Tiptap built-in function
  };

  return (
    <NodeViewWrapper
      className="resizable-image-wrapper"
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <img
        ref={imgRef}
        src={props.node.attrs.src}
        style={{
          width: props.node.attrs.width || "auto",
          maxWidth: "100%",
          display: "block",
        }}
      />

      {/* Resize handle */}
      <div
        onMouseDown={onMouseDown}
        style={{
          width: "12px",
          height: "12px",
          background: "blue",
          position: "absolute",
          right: "0",
          bottom: "0",
          cursor: "se-resize",
          borderRadius: "50%",
        }}
      ></div>

      {/* Delete button */}
      <button
        onClick={deleteImage}
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "20px",
          height: "20px",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        ×
      </button>
    </NodeViewWrapper>
  );
};

export const ResizableImage = Node.create({
  name: "resizableImage",

  group: "block",
  draggable: true,

  addAttributes() {
    return {
      src: {},
      width: { default: 'auto' },
    };
  },

  parseHTML() {
    return [{ tag: "img" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});
