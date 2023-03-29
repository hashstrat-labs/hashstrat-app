
// import {  roiDataForSwaps as indexRoiDataForSwaps } from '../indexRoiCalculator';
import { RingBuffer } from "../ringBuffer"
import { expect } from "chai";


describe("RingBuffer", () => {
    

    it('Has expected size', () => {
        const ring = new RingBuffer<number>(5);
        expect( ring.getSize() ).to.eql( 5 )
    });


    it('Can add itmes', () => {
        const ring = new RingBuffer<number>(5);
        ring.add(1, 2, 3, 4)
        
        expect( ring.toArray().length ).to.eql( 4 )
        expect( ring.toArray() ).to.eql( [1, 2, 3, 4] )

    });

    it('crops exceeding itmes', () => {
        const ring = new RingBuffer<number>(5);
        ring.add(1, 2, 3, 4, 5, 6)

        expect( ring.toArray().length ).to.eql( 5 )
        expect( ring.toArray() ).to.eql( [2, 3, 4, 5, 6] )
    });

    it('isFull', () => {
        const ring = new RingBuffer<number>(5);
        ring.add(1, 2, 3, 4)

        expect( ring.isFull() ).to.be.false

        ring.add(5)
        expect( ring.isFull() ).to.be.true

        ring.add(6)
        expect( ring.isFull() ).to.be.true

    });
    

});
   
  


